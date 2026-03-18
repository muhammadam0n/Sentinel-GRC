from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.v1.endpoints import auth, risks, audits, policies, action_plans, reports, evidence, frameworks

app = FastAPI(
    title="Sentinel GRC API",
    description="Cybersecurity Governance, Risk, and Compliance (GRC) Backend",
    version="1.0.0"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev purposes, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Sentinel GRC API"}

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(risks.router, prefix=f"{settings.API_V1_STR}/risks", tags=["risks"])
app.include_router(audits.router, prefix=f"{settings.API_V1_STR}/audits", tags=["audits"])
app.include_router(policies.router, prefix=f"{settings.API_V1_STR}/policies", tags=["policies"])
app.include_router(action_plans.router, prefix=f"{settings.API_V1_STR}/action-plans", tags=["action-plans"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
app.include_router(evidence.router, prefix=f"{settings.API_V1_STR}/evidence", tags=["evidence"])
app.include_router(frameworks.router, prefix=f"{settings.API_V1_STR}", tags=["frameworks"])
