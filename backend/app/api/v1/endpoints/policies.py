from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Policy, User
from app.schemas.policy import Policy as PolicySchema, PolicyCreate, PolicyUpdate
import os
from app.core.config import settings
import shutil

router = APIRouter()

@router.get("/", response_model=List[PolicySchema])
def list_policies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    policies = db.query(Policy).offset(skip).limit(limit).all()
    return policies

@router.post("/", response_model=PolicySchema)
def create_policy(
    *,
    db: Session = Depends(deps.get_db),
    policy_in: PolicyCreate,
    current_user: User = Depends(deps.check_role(["Admin"])),
) -> Any:
    policy = Policy(**policy_in.model_dump())
    if not policy.owner_id:
        policy.owner_id = current_user.id
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy

@router.post("/{id}/upload")
async def upload_policy_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.check_role(["Admin"])),
) -> Any:
    policy = db.query(Policy).filter(Policy.id == id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    file_path = os.path.join(settings.UPLOAD_DIR, f"policy_{id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    policy.document_file_name = file.filename
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return {"filename": file.filename}
