from typing import List, Optional
from pydantic import BaseModel


class FrameworkBase(BaseModel):
    name: str
    version: str
    description: Optional[str] = None


class FrameworkCreate(FrameworkBase):
    pass


class Framework(FrameworkBase):
    id: int

    class Config:
        from_attributes = True


class FrameworkDomainBase(BaseModel):
    name: str
    description: Optional[str] = None


class FrameworkDomainCreate(FrameworkDomainBase):
    framework_id: int


class FrameworkDomain(FrameworkDomainBase):
    id: int
    framework_id: int

    class Config:
        from_attributes = True


class ControlBase(BaseModel):
    control_code: str
    title: str
    description: Optional[str] = None


class ControlCreate(ControlBase):
    domain_id: int


class Control(ControlBase):
    id: int
    domain_id: int

    class Config:
        from_attributes = True


class SubControlBase(BaseModel):
    description: str


class SubControlCreate(SubControlBase):
    control_id: int


class SubControl(SubControlBase):
    id: int
    control_id: int

    class Config:
        from_attributes = True


class RiskControlMappingCreate(BaseModel):
    risk_id: int
    control_id: int


class RiskControlMapping(RiskControlMappingCreate):
    id: int

    class Config:
        from_attributes = True


class ControlWithSubControls(Control):
    sub_controls: List[SubControl] = []


class DomainWithControls(FrameworkDomain):
    controls: List[ControlWithSubControls] = []


class FrameworkTree(Framework):
    domains: List[DomainWithControls] = []
