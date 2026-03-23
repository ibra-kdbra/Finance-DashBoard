import prisma from "../../data/prisma.js";

const HF_API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions";

const buildSystemPrompt = (kpiData) => {
    if (!kpiData || kpiData.length === 0) {
        return `You are Aura, an expert AI financial advisor embedded in a financial analytics dashboard called FinanceRan. 
Help the user understand their business performance. Be concise, data-driven and insightful. 
No customer financial data is loaded yet — let the user know they can import data via the Import button.`;
    }

    const kpi = kpiData[0];
    const monthlyRevenues = kpi.monthlyData
        .map((m) => `${m.month}: Revenue $${Number(m.revenue).toLocaleString()}, Expenses $${Number(m.expenses).toLocaleString()}`)
        .join("\n");

    const totalRevenue = kpi.monthlyData.reduce((sum, m) => sum + Number(m.revenue), 0);
    const totalExpenses = kpi.monthlyData.reduce((sum, m) => sum + Number(m.expenses), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

    const revenueValues = kpi.monthlyData.map((m) => Number(m.revenue));
    const lastRevenue = revenueValues[revenueValues.length - 1];
    const firstRevenue = revenueValues[0];
    const revenueGrowth = (((lastRevenue - firstRevenue) / firstRevenue) * 100).toFixed(1);

    return `You are Aura, an expert AI financial advisor embedded in a financial analytics dashboard called FinanceRan.
You have access to the user's live financial data. Be concise, data-driven, insightful and professional.
Respond with bullet points or short paragraphs. Do not repeat the raw data unless asked.

## Current Financial Context:
- Total Revenue: $${totalRevenue.toLocaleString()}
- Total Expenses: $${totalExpenses.toLocaleString()}
- Net Profit: $${netProfit.toLocaleString()}
- Profit Margin: ${profitMargin}%
- Revenue Growth (first to last month): ${revenueGrowth}%

## Monthly Breakdown:
${monthlyRevenues}

Answer the user's financial questions using this data. If asked about forecasts or future projections, reason based on the trends you see. Always ground your answers in the actual numbers above.`;
};

export const chat = async (req, res) => {
    try {
        const { messages } = req.body;
        const userId = req.user?.id;

        // Fetch the KPI context for this user
        let kpiData = [];
        try {
            const kpi = await prisma.kPI.findFirst({
                where: {
                    userId: userId,
                    monthlyData: { some: {} }
                },
                include: { monthlyData: true },
                orderBy: { createdAt: 'desc' }
            });
            if (kpi) kpiData = [kpi];
        } catch (dbErr) {
            console.warn("Could not load KPI context for Aura:", dbErr.message);
        }

        const systemPrompt = buildSystemPrompt(kpiData);

        const payload = {
            model: "meta-llama/llama-3.3-70b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            max_tokens: 512,
            temperature: 0.6,
        };

        const hfResponse = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            console.error("HF API Error:", errText);
            return res.status(502).json({ message: "AI service error", detail: errText });
        }

        const data = await hfResponse.json();
        const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

        res.status(200).json({ reply });
    } catch (error) {
        console.error("Aura AI error:", error);
        res.status(500).json({ message: "Internal server error", detail: error.message });
    }
};

export const predictAnalysis = async (req, res) => {
    try {
        const { historicalData, modelType } = req.body;
        const FORECASTER_URL = process.env.FORECASTER_URL || "http://localhost:8000";

        // 1. Fetch Numerical Predictions from Python AI Service
        let projectedNumbers = [];
        let aiModel = "mathematical-regression";
        
        try {
            const numericValues = historicalData
                .map(d => Number(d["Actual Revenue"]))
                .filter(val => typeof val === "number" && !isNaN(val));
            const forecasterResponse = await fetch(`${FORECASTER_URL}/forecast`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: numericValues, prediction_length: 9 })
            });

            if (forecasterResponse.ok) {
                const forecastData = await forecasterResponse.json();
                projectedNumbers = forecastData.predictions;
                aiModel = forecastData.model;
                console.log(`Successfully fetched AI forecast from ${aiModel}`);
            } else {
                console.warn("Python Forecaster returned an error, falling back to basic math.");
            }
        } catch (err) {
            console.warn("Could not connect to Python Forecaster:", err.message);
        }

        // 2. Prepare Context for LLM Analysis (using the same Llama-3 logic)
        // We'll use the first 3 projections for the prompt
        const displayProjections = projectedNumbers.length > 0 
            ? projectedNumbers.slice(0, 3).map((v, i) => `- Month ${i+1}: $${Math.round(v).toLocaleString()}`).join("\n")
            : "Data unavailable for granular analysis.";

        const systemPrompt = `You are Aura, an expert AI financial analyst. 
The user is viewing their Revenue projections based on the ${aiModel} engine.

## Trailing Historical Data:
${historicalData.slice(-3).map(m => `- ${m.name}: $${Number(m["Actual Revenue"]).toLocaleString()}`).join("\n")}

## AI Projection Summary:
${displayProjections}

## Task:
Generate a single, dense, professional paragraph summarizing the strategic implications of this trajectory.
Respond ONLY with the analysis. No filler. Under 100 words.`;

        const payload = {
            model: "meta-llama/llama-3.3-70b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Analyze the regression data and provide the dynamic insights." }
            ],
            max_tokens: 300,
            temperature: 0.7,
        };

        const hfResponse = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            console.error("HF Predict API Error:", errText);
            return res.status(502).json({ message: "AI service error", detail: errText });
        }

        const data = await hfResponse.json();
        const analysis = data.choices?.[0]?.message?.content || "Strategic trajectory indicates standard market persistence.";

        res.status(200).json({ 
            analysis,
            aiPredictions: projectedNumbers,
            engine: aiModel
        });

    } catch (error) {
        console.error("Aura Predict AI error:", error);
        res.status(500).json({ message: "Internal server error", detail: error.message });
    }
};

