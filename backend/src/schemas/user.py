from typing import List
from uuid import UUID

from pydantic import BaseModel


class UserBase(BaseModel):
    email: str
    username: str
    fullName: str


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: str = None


class UserResponse(UserBase):
    id: UUID
    notifications: List[UUID]  # TODO

    class Config:
        from_attributes = True
