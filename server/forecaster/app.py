import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from chronos import ChronosPipeline
import pandas as pd
import numpy as np

app = FastAPI()

# Initialize the model (using chronos-t5-tiny for efficiency)
pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-tiny",
    device_map="cpu",  # Use CPU for now
    torch_dtype=torch.float32,
)

class ForecastRequest(BaseModel):
    data: list[float]
    prediction_length: int = 9

@app.get("/ping")
def ping():
    return {"status": "ok"}

@app.post("/forecast")
async def forecast(request: ForecastRequest):
    print(f"Incoming forecast request: {request.data}")
    try:
        if not request.data:
            raise HTTPException(status_code=400, detail="Data cannot be empty")
        
        # Prepare context tensor
        context = torch.tensor(request.data)
        
        # Perform forecasting
        forecast = pipeline.predict(
            context,
            prediction_length=request.prediction_length,
            num_samples=20, # Number of samples for stochastic forecast
        )
        
        # Calculate mean prediction from samples
        # forecast shape: [num_series, num_samples, prediction_length]
        mean_forecast = forecast[0].mean(dim=0).tolist()
        
        return {
            "predictions": mean_forecast,
            "model": "chronos-t5-tiny"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
