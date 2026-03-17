from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime
import enum

class PolicyStatus(str, enum.Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    RETIRED = "Retired"

class TaskStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default=PolicyStatus.DRAFT)
    last_reviewed_at = Column(DateTime, default=datetime.utcnow)
    document_file_name = Column(String, nullable=True)
    version = Column(String, default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow)

class ActionPlan(Base):
    __tablename__ = "action_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    assignee_id = Column(Integer, ForeignKey("users.id"))
    due_date = Column(DateTime)
    status = Column(String, default=TaskStatus.PENDING)
    risk_id = Column(Integer, ForeignKey("risks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assignee = relationship("User", back_populates="assigned_tasks")
    risk = relationship("Risk", back_populates="tasks")
