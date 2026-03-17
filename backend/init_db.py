from app.db.session import engine, Base
import app.models # Important to import all models before calling Base.metadata.create_all

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()
