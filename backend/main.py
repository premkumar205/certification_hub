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
    allow_origins=["*"], # In production, replace "*" with your specific frontend domains
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
