from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Evidence, User
from app.schemas.audit import Evidence as EvidenceSchema, EvidenceCreate
import os
from app.core.config import settings
import shutil

router = APIRouter()

@router.get("/", response_model=List[EvidenceSchema])
def list_evidence(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    evidence = db.query(Evidence).offset(skip).limit(limit).all()
    return evidence

@router.post("/upload", response_model=EvidenceSchema)
async def upload_evidence(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    audit_id: int = None,
    control_id: int = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    file_path = os.path.join(settings.UPLOAD_DIR, f"evidence_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    evidence = Evidence(
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        size_bytes=os.path.getsize(file_path),
        audit_id=audit_id,
        control_id=control_id
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence
