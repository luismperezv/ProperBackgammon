from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime
import time

START_TIME = time.time()

app = FastAPI(title="Backgammon Game API")

# Configure CORS - more permissive in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Welcome to Backgammon Game API"}

@app.get("/api")
async def api_root():
    return {
        "status": "ok",
        "version": "1.0.0",
        "endpoints": [
            "/api/health",
            "/api/game"
        ]
    }

@app.get("/api/health")
async def health_check():
    try:
        return {
            "status": "healthy",
            "timestamp": str(datetime.datetime.now()),
            "uptime": str(time.time() - START_TIME)
        }
    except Exception as e:
        print(f"Health check error: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.get("/api/game")
async def list_games():
    return {
        "status": "ok",
        "games": []  # TODO: Implement game listing
    } 