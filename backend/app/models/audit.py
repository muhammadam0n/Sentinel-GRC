from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime
import enum

class AuditStatus(str, enum.Enum):
    PLANNED = "Planned"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class FindingSeverity(str, enum.Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    scope = Column(Text)
    status = Column(String, default=AuditStatus.PLANNED)
    control_id = Column(Integer, ForeignKey("controls.id"), nullable=True)
    auditor_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    control = relationship("Control", back_populates="audits")
    findings = relationship("AuditFinding", back_populates="audit")
    evidence = relationship("Evidence", back_populates="audit")

class AuditFinding(Base):
    __tablename__ = "audit_findings"
    
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audits.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    severity = Column(String, default=FindingSeverity.MEDIUM)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    audit = relationship("Audit", back_populates="findings")

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String)
    size_bytes = Column(Integer)
    audit_id = Column(Integer, ForeignKey("audits.id"), nullable=True)
    control_id = Column(Integer, ForeignKey("controls.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    audit = relationship("Audit", back_populates="evidence")
    control = relationship("Control", back_populates="evidence")
