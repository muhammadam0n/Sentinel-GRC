from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.risk import RiskStatus, RiskCategory

class RiskBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    owner_id: Optional[int] = None
    likelihood: Optional[int] = 3
    impact: Optional[int] = 3
    status: Optional[str] = RiskStatus.OPEN

class RiskCreate(RiskBase):
    title: str

class RiskUpdate(RiskBase):
    pass

class Risk(RiskBase):
    id: int
    score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RiskAssessmentBase(BaseModel):
    likelihood: int
    impact: int
    comments: Optional[str] = None

class RiskAssessmentCreate(RiskAssessmentBase):
    risk_id: int

class RiskAssessment(RiskAssessmentBase):
    id: int
    risk_id: int
    assessor_id: int
    score: int
    assessed_at: datetime

    class Config:
        from_attributes = True
