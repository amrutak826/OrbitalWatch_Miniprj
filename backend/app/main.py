from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Correct imports
from app.api import collision_routes, risk_routes

app = FastAPI(title="Orbital Watch API")
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CORS (to allow frontend http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Include all routes
app.include_router(collision_routes.router)
app.include_router(risk_routes.router)

@app.get("/")
def root():
    return {"message": "OrbitalWatch backend running"}
