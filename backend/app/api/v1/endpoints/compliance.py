from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Framework, Control, RiskControlMapping, User
from app.schemas.compliance import (
    Framework as FrameworkSchema, FrameworkCreate, FrameworkUpdate,
    Control as ControlSchema, ControlCreate, ControlUpdate,
    RiskControlMapping as RiskControlMappingSchema, RiskControlMappingCreate
)

router = APIRouter()

# Framework Endpoints
@router.get("/frameworks", response_model=List[FrameworkSchema])
def list_frameworks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    frameworks = db.query(Framework).offset(skip).limit(limit).all()
    return frameworks

@router.post("/frameworks", response_model=FrameworkSchema)
def create_framework(
    *,
    db: Session = Depends(deps.get_db),
    framework_in: FrameworkCreate,
    current_user: User = Depends(deps.check_role(["Admin"])),
) -> Any:
    framework = Framework(**framework_in.model_dump())
    db.add(framework)
    db.commit()
    db.refresh(framework)
    return framework

# Control Endpoints
@router.get("/controls", response_model=List[ControlSchema])
def list_controls(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    controls = db.query(Control).offset(skip).limit(limit).all()
    return controls

@router.post("/controls", response_model=ControlSchema)
def create_control(
    *,
    db: Session = Depends(deps.get_db),
    control_in: ControlCreate,
    current_user: User = Depends(deps.check_role(["Admin"])),
) -> Any:
    control = Control(**control_in.model_dump())
    db.add(control)
    db.commit()
    db.refresh(control)
    return control

# Risk Control Mapping
@router.post("/mapping", response_model=RiskControlMappingSchema)
def map_risk_to_control(
    *,
    db: Session = Depends(deps.get_db),
    mapping_in: RiskControlMappingCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    mapping = db.query(RiskControlMapping).filter(
        RiskControlMapping.risk_id == mapping_in.risk_id,
        RiskControlMapping.control_id == mapping_in.control_id
    ).first()
    if mapping:
        raise HTTPException(status_code=400, detail="Mapping already exists")
    
    mapping = RiskControlMapping(**mapping_in.model_dump())
    db.add(mapping)
    db.commit()
    db.refresh(mapping)
    return mapping
