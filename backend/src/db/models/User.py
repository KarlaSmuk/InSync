import uuid

from sqlalchemy import Column, VARCHAR, UUID

from .Base import Base


class User(Base):
    __tablename__ = 'user'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    email = Column(VARCHAR(320), unique=True, nullable=False)
    username = Column(VARCHAR(50), unique=True, nullable=False)
    passwordHash = Column(VARCHAR, nullable=False)
    fullName = Column(VARCHAR(100), nullable=False)
