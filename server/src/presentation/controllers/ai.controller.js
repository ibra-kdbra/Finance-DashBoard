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
        const { historicalData } = req.body;

        const systemPrompt = `You are Aura, an expert financial forecaster.
Analyze the following historical revenue data and generate a 9-month forecast plus a strategic summary.

## Historical Data (Last 12 Mo):
${historicalData.map(m => `- ${m.name}: $${Number(m["Actual Revenue"]).toLocaleString()}`).join("\n")}

## Task:
1. Extrapolate the next 9 months of revenue based on current velocity, seasonality, and momentum.
2. Provide a professional strategic analysis paragraph (under 80 words) avoiding filler.

## Output Format:
You MUST respond with a valid JSON object only. No conversational text.
Format:
{
  "predictions": [month1_val, month2_val, ..., month9_val],
  "analysis": "Your strategic paragraph here"
}
Ensure all prediction values are numbers, not strings. Use raw numbers without commas.`;

        const payload = {
            model: "meta-llama/llama-3.3-70b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Perform the 9-month neural forecast and strategic analysis." }
            ],
            max_tokens: 600,
            temperature: 0.4, // Lower temperature for more consistent numerical output
            response_format: { type: "json_object" }
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
            return res.status(502).json({ message: "AI service error" });
        }

        const data = await hfResponse.json();
        let result;
        try {
            result = JSON.parse(data.choices?.[0]?.message?.content);
        } catch (parseErr) {
            console.error("AI JSON Parse Error:", data.choices?.[0]?.message?.content);
            return res.status(500).json({ message: "AI returned invalid format" });
        }

        res.status(200).json({ 
            analysis: result.analysis,
            aiPredictions: result.predictions,
            engine: "llama-3-neural"
        });

    } catch (error) {
        console.error("Aura Predict AI error:", error);
        res.status(500).json({ message: "Internal server error", detail: error.message });
    }
};

