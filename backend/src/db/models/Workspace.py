import uuid

from sqlalchemy import Column, UUID, VARCHAR, TEXT

from .Base import Base


class Workspace(Base):
    __tablename__ = 'workspace'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(VARCHAR(100), nullable=False)
    description = Column(TEXT)
    status = Column(VARCHAR, nullable=False)
