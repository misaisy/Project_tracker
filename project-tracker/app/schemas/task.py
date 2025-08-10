from enum import Enum
from typing import Optional
from ..db.models import TaskStatus
from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    """Статусы задачи."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskBase(BaseModel):
    """Базовая схема задачи."""
    title: str = Field(..., max_length=100, example="Implement feature", description="Название задачи")
    status: TaskStatus = Field(TaskStatus.TODO, example="todo", description="Статус задачи")


class TaskCreate(TaskBase):
    """Схема для создания задачи."""
    title: str
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    """Схема для обновления задачи."""
    title: Optional[str] = Field(None, max_length=100, example="Updated task", description="Новое название задачи")
    status: Optional[TaskStatus] = Field(None, example="in_progress", description="Новый статус задачи")


class TaskOut(TaskBase):
    """Схема для вывода данных задачи."""
    id: int = Field(..., example=1, description="ID задачи")
    project_id: int = Field(..., example=1, description="ID проекта")

    class Config:
        from_attributes = True