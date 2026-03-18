from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Risk
from app.schemas.risk import Risk as RiskSchema, RiskCreate, RiskUpdate

router = APIRouter()

@router.get("/", response_model=List[RiskSchema])
def list_risks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    risks = db.query(Risk).offset(skip).limit(limit).all()
    return risks

@router.post("/", response_model=RiskSchema)
def create_risk(
    *,
    db: Session = Depends(deps.get_db),
    risk_in: RiskCreate,
) -> Any:
    risk = Risk(
        title=risk_in.title,
        description=risk_in.description,
        category=risk_in.category,
        owner_id=risk_in.owner_id,
        likelihood=risk_in.likelihood,
        impact=risk_in.impact,
        score=risk_in.likelihood * risk_in.impact,
        status=risk_in.status,
    )
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk

@router.put("/{id}", response_model=RiskSchema)
def update_risk(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    risk_in: RiskUpdate,
) -> Any:
    risk = db.query(Risk).filter(Risk.id == id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    
    update_data = risk_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(risk, field, update_data[field])
    
    # Recalculate score if likelihood or impact changed
    if "likelihood" in update_data or "impact" in update_data:
        risk.score = risk.likelihood * risk.impact
        
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk

@router.delete("/{id}", response_model=RiskSchema)
def delete_risk(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    risk = db.query(Risk).filter(Risk.id == id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    db.delete(risk)
    db.commit()
    return risk
