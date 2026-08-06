from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TaskCommentViewSet, TaskAttachmentViewSet, TimeLogViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'task-comments', TaskCommentViewSet, basename='task-comment')
router.register(r'task-attachments', TaskAttachmentViewSet, basename='task-attachment')
router.register(r'time-logs', TimeLogViewSet, basename='time-log')

urlpatterns = [
    path('', include(router.urls)),
]
