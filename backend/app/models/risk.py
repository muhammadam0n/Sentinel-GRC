from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime
import enum

class RiskStatus(str, enum.Enum):
    OPEN = "Open"
    MITIGATED = "Mitigated"
    ACCEPTED = "Accepted"
    CLOSED = "Closed"

class RiskCategory(str, enum.Enum):
    ACCESS_CONTROL = "Access Control"
    NETWORK_SECURITY = "Network Security"
    DATA_PROTECTION = "Data Protection"
    THIRD_PARTY = "Third-Party"
    HUMAN_FACTORS = "Human Factors"
    INCIDENT_RESPONSE = "Incident Response"

class Risk(Base):
    __tablename__ = "risks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    category = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    likelihood = Column(Integer, default=3)  # 1-5
    impact = Column(Integer, default=3)      # 1-5
    score = Column(Integer, default=9)       # likelihood * impact
    status = Column(String, default=RiskStatus.OPEN)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="owned_risks")
    assessments = relationship("RiskAssessment", back_populates="risk")
    mapped_controls = relationship("RiskControlMapping", back_populates="risk")
    tasks = relationship("ActionPlan", back_populates="risk")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    risk_id = Column(Integer, ForeignKey("risks.id"))
    assessor_id = Column(Integer, ForeignKey("users.id"))
    likelihood = Column(Integer)
    impact = Column(Integer)
    score = Column(Integer)
    comments = Column(Text)
    assessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    risk = relationship("Risk", back_populates="assessments")
