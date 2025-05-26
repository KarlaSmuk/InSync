# services/user_service.py
import uuid
from uuid import UUID

from sqlalchemy.orm import Session

from db.models import User, Notification, RecipientNotification, WorkspaceUser, AssigneeTask
from schemas.user import UserCreate, UserUpdate, DashboardSummary
from utils.auth import get_password_hash


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserCreate):
        # Check if email exists
        if self.db.query(User).filter(User.email == user.email).first():
            raise ValueError("User with this email already exists.")

        # Check if username exists
        if self.db.query(User).filter(User.username == user.username).first():
            raise ValueError("User with this username already exists.")

        hashedPassword = get_password_hash(user.password)

        new_user = User(
            id=uuid.uuid4(),
            email=user.email,
            username=user.username,
            passwordHash=hashedPassword,
            fullName=user.fullName
        )

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_user(self, user_id: UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        return user

    def get_users(self):
        users = self.db.query(User).all()
        return users

    def update_user(self, user_id: UUID, user_update: UserUpdate):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        # Update user fields
        user.email = user_update.email or user.email
        user.username = user_update.username or user.username
        user.passwordHash = user_update.password_hash or user.passwordHash
        user.fullName = user_update.full_name or user.fullName

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        self.db.delete(user)
        self.db.commit()
        return user

    def get_user_notifications(self, user_id: UUID):
        notifications = self.db.query(Notification).join(RecipientNotification).filter(
            RecipientNotification.recipientId == user_id).all()

        return notifications

    def get_dashboard_summary(self, user_id: UUID) -> DashboardSummary | None:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        workspace_count = self.db.query(WorkspaceUser).filter_by(userId=user.id).count()
        task_count = self.db.query(AssigneeTask).filter_by(assigneeId=user.id).count()
        unread_notifications = self.db.query(RecipientNotification).filter_by(
            recipientId=user.id, isRead=False
        ).count()

        return DashboardSummary(
            workspaceCount=workspace_count,
            taskCount=task_count,
            unreadNotifications=unread_notifications
        )
