from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class Framework(Base):
    __tablename__ = "frameworks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    controls = relationship("Control", back_populates="framework")

class Control(Base):
    __tablename__ = "controls"
    
    id = Column(Integer, primary_key=True, index=True)
    framework_id = Column(Integer, ForeignKey("frameworks.id"))
    code = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    framework = relationship("Framework", back_populates="controls")
    mapped_risks = relationship("RiskControlMapping", back_populates="control")
    audits = relationship("Audit", back_populates="control")
    evidence = relationship("Evidence", back_populates="control")

class RiskControlMapping(Base):
    __tablename__ = "risk_control_mapping"
    
    id = Column(Integer, primary_key=True, index=True)
    risk_id = Column(Integer, ForeignKey("risks.id"))
    control_id = Column(Integer, ForeignKey("controls.id"))
    mapping_type = Column(String, default="Primary")  # Primary, Secondary, etc.
    mapped_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    risk = relationship("Risk", back_populates="mapped_controls")
    control = relationship("Control", back_populates="mapped_risks")
