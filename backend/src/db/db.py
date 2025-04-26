import logging
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Function to construct the connection string
def get_database_url() -> str:
    # Load environment variables from .env
    load_dotenv()

    # Fetch variables
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")
    db_name = os.getenv("DB_NAME")
    # Construct the SQLAlchemy connection string
    return f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}?sslmode=require"


# Create the SQLAlchemy engine
engine = create_engine(get_database_url(), echo=True)  # echo set to True to see SQL logs
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# For interaction with database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
