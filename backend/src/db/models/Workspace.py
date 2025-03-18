import uuid

from sqlalchemy import Column, UUID, VARCHAR, TEXT, ForeignKey
from sqlalchemy.orm import relationship

from .Base import Base


class Workspace(Base):
    __tablename__ = 'workspace'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(VARCHAR(225), nullable=False)
    description = Column(TEXT)
    status = Column(VARCHAR, nullable=False)

    # Foreign keys
    ownerId = Column(UUID, ForeignKey('user.id'))

    # relationships
    owner = relationship("User", back_populates="workspaces")
