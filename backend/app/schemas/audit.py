from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.audit import AuditStatus, FindingSeverity

class AuditBase(BaseModel):
    title: Optional[str] = None
    scope: Optional[str] = None
    status: Optional[str] = AuditStatus.PLANNED
    control_id: Optional[int] = None
    auditor_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class AuditCreate(AuditBase):
    title: str

class AuditUpdate(AuditBase):
    pass

class Audit(AuditBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AuditFindingBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = FindingSeverity.MEDIUM
    status: Optional[str] = "Open"
    audit_id: Optional[int] = None

class AuditFindingCreate(AuditFindingBase):
    title: str
    audit_id: int

class AuditFindingUpdate(AuditFindingBase):
    pass

class AuditFinding(AuditFindingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class EvidenceBase(BaseModel):
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    size_bytes: Optional[int] = None
    audit_id: Optional[int] = None
    control_id: Optional[int] = None

class EvidenceCreate(EvidenceBase):
    file_name: str
    file_path: str

class Evidence(EvidenceBase):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True
