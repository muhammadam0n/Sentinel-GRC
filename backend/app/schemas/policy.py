from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.policy import PolicyStatus

class PolicyBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None
    status: Optional[str] = PolicyStatus.DRAFT
    last_reviewed_at: Optional[datetime] = None
    document_file_name: Optional[str] = None
    version: Optional[str] = "1.0"

class PolicyCreate(PolicyBase):
    title: str

class PolicyUpdate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
