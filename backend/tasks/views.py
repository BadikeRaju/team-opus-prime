from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task, TaskComment, TaskAttachment, TimeLog
from .serializers import TaskSerializer, TaskCommentSerializer, TaskAttachmentSerializer, TimeLogSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['project', 'sprint', 'column', 'assignee', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority']

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskComment.objects.filter(task__project__in=self.request.user.projects.all() | self.request.user.owned_projects.all())

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class TaskAttachmentViewSet(viewsets.ModelViewSet):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)

class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all()
    serializer_class = TimeLogSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['task', 'user']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
