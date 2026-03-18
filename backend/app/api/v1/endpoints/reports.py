from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api import deps
from app.models import Risk, Audit, Framework, Control, User
import os
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.get("/risks/csv")
def export_risks_csv(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    try:
        import pandas as pd
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Report export requires optional dependencies. Install backend/requirements.optional.txt",
        )
    risks = db.query(Risk).all()
    data = []
    for risk in risks:
        data.append({
            "ID": risk.id,
            "Title": risk.title,
            "Category": risk.category,
            "Likelihood": risk.likelihood,
            "Impact": risk.impact,
            "Score": risk.score,
            "Status": risk.status,
            "Created At": risk.created_at
        })
    df = pd.DataFrame(data)
    
    with NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
        df.to_csv(tmp.name, index=False)
        return FileResponse(
            tmp.name, 
            media_type="text/csv", 
            filename="risk_report.csv"
        )

@router.get("/risks/pdf")
def export_risks_pdf(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    try:
        import pandas as pd
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Report export requires optional dependencies. Install backend/requirements.optional.txt",
        )
    risks = db.query(Risk).all()
    
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        c = canvas.Canvas(tmp.name, pagesize=letter)
        c.drawString(100, 750, "Sentinel GRC - Risk Report")
        c.drawString(100, 730, f"Generated on: {pd.Timestamp.now()}")
        
        y = 700
        for risk in risks:
            c.drawString(100, y, f"ID: {risk.id} | {risk.title} | Score: {risk.score} | Status: {risk.status}")
            y -= 20
            if y < 50:
                c.showPage()
                y = 750
        
        c.save()
        return FileResponse(
            tmp.name, 
            media_type="application/pdf", 
            filename="risk_report.pdf"
        )
