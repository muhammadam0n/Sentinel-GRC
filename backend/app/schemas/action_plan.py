from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.action_plan import TaskStatus

class ActionPlanBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = TaskStatus.PENDING
    risk_id: Optional[int] = None

class ActionPlanCreate(ActionPlanBase):
    title: str

class ActionPlanUpdate(ActionPlanBase):
    pass

class ActionPlan(ActionPlanBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
