from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from app.db.session import Base
from datetime import datetime
import enum


class PolicyStatus(str, enum.Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    RETIRED = "Retired"


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

