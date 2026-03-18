from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base


class Framework(Base):
    __tablename__ = "frameworks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    version = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    domains = relationship(
        "FrameworkDomain",
        back_populates="framework",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class FrameworkDomain(Base):
    __tablename__ = "framework_domains"

    id = Column(Integer, primary_key=True, index=True)
    framework_id = Column(
        Integer, ForeignKey("frameworks.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)

    framework = relationship("Framework", back_populates="domains")
    controls = relationship(
        "Control", back_populates="domain", cascade="all, delete-orphan", passive_deletes=True
    )


class Control(Base):
    __tablename__ = "controls"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(
        Integer, ForeignKey("framework_domains.id", ondelete="CASCADE"), index=True, nullable=False
    )
    control_code = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    domain = relationship("FrameworkDomain", back_populates="controls")
    sub_controls = relationship(
        "SubControl",
        back_populates="control",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    mapped_risks = relationship("RiskControlMapping", back_populates="control")
    audits = relationship("Audit", back_populates="control")
    evidence = relationship("Evidence", back_populates="control")


class SubControl(Base):
    __tablename__ = "sub_controls"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(
        Integer, ForeignKey("controls.id", ondelete="CASCADE"), index=True, nullable=False
    )
    description = Column(Text, nullable=False)

    control = relationship("Control", back_populates="sub_controls")


class RiskControlMapping(Base):
    __tablename__ = "risk_control_mapping"
    __table_args__ = (UniqueConstraint("risk_id", "control_id", name="uq_risk_control"),)

    id = Column(Integer, primary_key=True, index=True)
    risk_id = Column(Integer, ForeignKey("risks.id", ondelete="CASCADE"), index=True, nullable=False)
    control_id = Column(
        Integer, ForeignKey("controls.id", ondelete="CASCADE"), index=True, nullable=False
    )

    risk = relationship("Risk", back_populates="mapped_controls")
    control = relationship("Control", back_populates="mapped_risks")
