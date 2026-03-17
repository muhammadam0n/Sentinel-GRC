from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models import ActionPlan, User
from app.schemas.action_plan import ActionPlan as ActionPlanSchema, ActionPlanCreate, ActionPlanUpdate

router = APIRouter()

@router.get("/", response_model=List[ActionPlanSchema])
def list_action_plans(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    action_plans = db.query(ActionPlan).offset(skip).limit(limit).all()
    return action_plans

@router.post("/", response_model=ActionPlanSchema)
def create_action_plan(
    *,
    db: Session = Depends(deps.get_db),
    action_plan_in: ActionPlanCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    action_plan = ActionPlan(**action_plan_in.model_dump())
    if not action_plan.assignee_id:
        action_plan.assignee_id = current_user.id
    db.add(action_plan)
    db.commit()
    db.refresh(action_plan)
    return action_plan

@router.put("/{id}", response_model=ActionPlanSchema)
def update_action_plan(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    action_plan_in: ActionPlanUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    action_plan = db.query(ActionPlan).filter(ActionPlan.id == id).first()
    if not action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    update_data = action_plan_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(action_plan, field, update_data[field])
    
    db.add(action_plan)
    db.commit()
    db.refresh(action_plan)
    return action_plan
