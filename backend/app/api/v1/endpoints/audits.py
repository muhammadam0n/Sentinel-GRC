from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Audit, AuditFinding, User
from app.schemas.audit import (
    Audit as AuditSchema, AuditCreate, AuditUpdate,
    AuditFinding as AuditFindingSchema, AuditFindingCreate, AuditFindingUpdate
)

router = APIRouter()

# Audit Endpoints
@router.get("/", response_model=List[AuditSchema])
def list_audits(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    audits = db.query(Audit).offset(skip).limit(limit).all()
    return audits

@router.post("/", response_model=AuditSchema)
def create_audit(
    *,
    db: Session = Depends(deps.get_db),
    audit_in: AuditCreate,
    current_user: User = Depends(deps.check_role(["Admin", "Auditor"])),
) -> Any:
    audit = Audit(**audit_in.model_dump())
    if not audit.auditor_id:
        audit.auditor_id = current_user.id
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit

@router.put("/{id}", response_model=AuditSchema)
def update_audit(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    audit_in: AuditUpdate,
    current_user: User = Depends(deps.check_role(["Admin", "Auditor"])),
) -> Any:
    audit = db.query(Audit).filter(Audit.id == id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    update_data = audit_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(audit, field, update_data[field])
    
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit

# Audit Finding Endpoints
@router.get("/{id}/findings", response_model=List[AuditFindingSchema])
def list_audit_findings(
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    findings = db.query(AuditFinding).filter(AuditFinding.audit_id == id).all()
    return findings

@router.post("/{id}/findings", response_model=AuditFindingSchema)
def create_audit_finding(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    finding_in: AuditFindingCreate,
    current_user: User = Depends(deps.check_role(["Admin", "Auditor"])),
) -> Any:
    finding_in.audit_id = id
    finding = AuditFinding(**finding_in.model_dump())
    db.add(finding)
    db.commit()
    db.refresh(finding)
    return finding
