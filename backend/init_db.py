from app.db.session import engine, Base, SessionLocal
import app.models

from app.models import Framework, FrameworkDomain, Control, SubControl

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_frameworks(db)
    finally:
        db.close()
    print("Database tables created successfully.")


def seed_frameworks(db):
    if db.query(Framework).count() > 0:
        return

    def add_framework(name: str, version: str, description: str, domain_name: str, control_code: str, control_title: str):
        fw = Framework(name=name, version=version, description=description)
        db.add(fw)
        db.flush()
        domain = FrameworkDomain(framework_id=fw.id, name=domain_name, description=None)
        db.add(domain)
        db.flush()
        control = Control(
            domain_id=domain.id,
            control_code=control_code,
            title=control_title,
            description=None,
        )
        db.add(control)
        db.flush()
        sub = SubControl(control_id=control.id, description="Minimal sample sub-control")
        db.add(sub)

    add_framework(
        name="ISO 27001",
        version="2022",
        description="Information Security Management System (ISMS)",
        domain_name="Access Control",
        control_code="A.5",
        control_title="User Access Management",
    )
    add_framework(
        name="NIST CSF",
        version="2.0",
        description="NIST Cybersecurity Framework",
        domain_name="Identify",
        control_code="ID.AM",
        control_title="Asset Management",
    )
    add_framework(
        name="GDPR",
        version="2016/679",
        description="General Data Protection Regulation",
        domain_name="Data Protection",
        control_code="Art. 5",
        control_title="Personal Data Processing",
    )
    add_framework(
        name="HIPAA",
        version="1996",
        description="Health Insurance Portability and Accountability Act",
        domain_name="Security Rule",
        control_code="164.312",
        control_title="Access Control",
    )
    add_framework(
        name="PCI-DSS",
        version="4.0",
        description="Payment Card Industry Data Security Standard",
        domain_name="Network Security",
        control_code="1.2",
        control_title="Firewall Configuration",
    )
    add_framework(
        name="SOC 2",
        version="2017",
        description="Service Organization Control 2",
        domain_name="Security",
        control_code="CC6.1",
        control_title="Logical Access",
    )
    add_framework(
        name="CIS Controls",
        version="v8",
        description="Center for Internet Security Controls",
        domain_name="Basic Controls",
        control_code="1.1",
        control_title="Inventory of Assets",
    )
    add_framework(
        name="COBIT",
        version="2019",
        description="Control Objectives for Information and Related Technologies",
        domain_name="Governance",
        control_code="EDM03",
        control_title="Risk Management",
    )

    db.commit()

if __name__ == "__main__":
    init_db()
