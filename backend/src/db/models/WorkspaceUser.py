from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .Base import Base


class WorkspaceUser(Base):
    __tablename__ = 'workspace_user'

    workspaceId = Column(UUID, ForeignKey("workspace.id"), primary_key=True)
    userId = Column(UUID, ForeignKey("user.id"), primary_key=True)

    # relationships
    user = relationship("User", back_populates="workspace_memberships")
    workspace = relationship("Workspace", back_populates="memberships")
