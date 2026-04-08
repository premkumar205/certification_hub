from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

from routers import users, certificates

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CertifyHub API",
    description="Backend for CertifyHub full-stack application",
    version="1.0.0"
)

# Configure CORS so the frontend (like GitHub Pages) can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://premkumar205.github.io",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(certificates.router)

@app.get("/")
def root():
    return {"message": "Welcome to the CertifyHub API!"}
