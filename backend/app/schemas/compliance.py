from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class FrameworkBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class FrameworkCreate(FrameworkBase):
    name: str

class FrameworkUpdate(FrameworkBase):
    pass

class Framework(FrameworkBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ControlBase(BaseModel):
    code: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    framework_id: Optional[int] = None

class ControlCreate(ControlBase):
    code: str
    title: str
    framework_id: int

class ControlUpdate(ControlBase):
    pass

class Control(ControlBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RiskControlMappingCreate(BaseModel):
    risk_id: int
    control_id: int
    mapping_type: Optional[str] = "Primary"

class RiskControlMapping(RiskControlMappingCreate):
    id: int
    mapped_at: datetime

    class Config:
        from_attributes = True
