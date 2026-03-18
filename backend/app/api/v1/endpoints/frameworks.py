from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api import deps
from app.models import Framework, FrameworkDomain, Control, SubControl, Risk, RiskControlMapping
from app.schemas.compliance import (
    Framework as FrameworkSchema,
    FrameworkCreate,
    FrameworkDomain as DomainSchema,
    FrameworkDomainCreate,
    Control as ControlSchema,
    ControlCreate,
    SubControl as SubControlSchema,
    SubControlCreate,
    RiskControlMapping as RiskControlMappingSchema,
    FrameworkTree,
)

router = APIRouter()


@router.get("/frameworks", response_model=List[FrameworkSchema])
def list_frameworks(db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 100) -> Any:
    return db.query(Framework).offset(skip).limit(limit).all()


@router.post("/frameworks", response_model=FrameworkSchema, status_code=status.HTTP_201_CREATED)
def create_framework(*, db: Session = Depends(deps.get_db), framework_in: FrameworkCreate) -> Any:
    existing = db.query(Framework).filter(Framework.name == framework_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Framework already exists")
    framework = Framework(**framework_in.model_dump())
    db.add(framework)
    db.commit()
    db.refresh(framework)
    return framework


@router.get("/frameworks/{framework_id}/domains", response_model=List[DomainSchema])
def list_domains(framework_id: int, db: Session = Depends(deps.get_db)) -> Any:
    framework = db.query(Framework).filter(Framework.id == framework_id).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    return db.query(FrameworkDomain).filter(FrameworkDomain.framework_id == framework_id).all()


@router.post(
    "/frameworks/{framework_id}/domains", response_model=DomainSchema, status_code=status.HTTP_201_CREATED
)
def create_domain(
    framework_id: int, *, db: Session = Depends(deps.get_db), domain_in: FrameworkDomainCreate
) -> Any:
    if domain_in.framework_id != framework_id:
        raise HTTPException(status_code=400, detail="framework_id mismatch")
    framework = db.query(Framework).filter(Framework.id == framework_id).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    domain = FrameworkDomain(**domain_in.model_dump())
    db.add(domain)
    db.commit()
    db.refresh(domain)
    return domain


@router.get("/domains/{domain_id}/controls", response_model=List[ControlSchema])
def list_controls(domain_id: int, db: Session = Depends(deps.get_db)) -> Any:
    domain = db.query(FrameworkDomain).filter(FrameworkDomain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db.query(Control).filter(Control.domain_id == domain_id).all()


@router.post("/domains/{domain_id}/controls", response_model=ControlSchema, status_code=status.HTTP_201_CREATED)
def create_control(domain_id: int, *, db: Session = Depends(deps.get_db), control_in: ControlCreate) -> Any:
    if control_in.domain_id != domain_id:
        raise HTTPException(status_code=400, detail="domain_id mismatch")
    domain = db.query(FrameworkDomain).filter(FrameworkDomain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    control = Control(**control_in.model_dump())
    db.add(control)
    db.commit()
    db.refresh(control)
    return control


@router.get("/controls/{control_id}/sub-controls", response_model=List[SubControlSchema])
def list_sub_controls(control_id: int, db: Session = Depends(deps.get_db)) -> Any:
    control = db.query(Control).filter(Control.id == control_id).first()
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")
    return db.query(SubControl).filter(SubControl.control_id == control_id).all()


@router.post(
    "/controls/{control_id}/sub-controls",
    response_model=SubControlSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_sub_control(
    control_id: int, *, db: Session = Depends(deps.get_db), sub_control_in: SubControlCreate
) -> Any:
    if sub_control_in.control_id != control_id:
        raise HTTPException(status_code=400, detail="control_id mismatch")
    control = db.query(Control).filter(Control.id == control_id).first()
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")
    sub = SubControl(**sub_control_in.model_dump())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.get("/frameworks/{framework_id}/tree", response_model=FrameworkTree)
def get_framework_tree(framework_id: int, db: Session = Depends(deps.get_db)) -> Any:
    framework = (
        db.query(Framework)
        .options(
            joinedload(Framework.domains)
            .joinedload(FrameworkDomain.controls)
            .joinedload(Control.sub_controls)
        )
        .filter(Framework.id == framework_id)
        .first()
    )
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    return framework


@router.post(
    "/risks/{risk_id}/controls/{control_id}",
    response_model=RiskControlMappingSchema,
    status_code=status.HTTP_201_CREATED,
)
def map_risk_to_control(risk_id: int, control_id: int, db: Session = Depends(deps.get_db)) -> Any:
    risk = db.query(Risk).filter(Risk.id == risk_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    control = db.query(Control).filter(Control.id == control_id).first()
    if not control:
        raise HTTPException(status_code=404, detail="Control not found")

    existing = (
        db.query(RiskControlMapping)
        .filter(RiskControlMapping.risk_id == risk_id, RiskControlMapping.control_id == control_id)
        .first()
    )
    if existing:
        return existing

    mapping = RiskControlMapping(risk_id=risk_id, control_id=control_id)
    db.add(mapping)
    db.commit()
    db.refresh(mapping)
    return mapping


@router.delete("/risks/{risk_id}/controls/{control_id}", status_code=status.HTTP_204_NO_CONTENT)
def unmap_risk_from_control(risk_id: int, control_id: int, db: Session = Depends(deps.get_db)) -> Any:
    mapping = (
        db.query(RiskControlMapping)
        .filter(RiskControlMapping.risk_id == risk_id, RiskControlMapping.control_id == control_id)
        .first()
    )
    if not mapping:
        return None
    db.delete(mapping)
    db.commit()
    return None


@router.get("/risks/{risk_id}/controls", response_model=List[ControlSchema])
def list_controls_for_risk(risk_id: int, db: Session = Depends(deps.get_db)) -> Any:
    risk = db.query(Risk).filter(Risk.id == risk_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    controls = (
        db.query(Control)
        .join(RiskControlMapping, RiskControlMapping.control_id == Control.id)
        .filter(RiskControlMapping.risk_id == risk_id)
        .all()
    )
    return controls

