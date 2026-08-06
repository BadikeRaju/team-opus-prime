from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Project, Sprint, Board, BoardColumn
from .serializers import ProjectSerializer, SprintSerializer, BoardSerializer, BoardColumnSerializer
from users.permissions import IsProjectManagerOrAdmin
from django.db.models import Q

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Project.objects.all()
        # Non-admins only see projects they own or are members of
        return Project.objects.filter(Q(owner=user) | Q(members=user)).distinct()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProjectManagerOrAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        # Create a default board for the project
        board = Board.objects.create(project=project, name=f"{project.name} Board")
        # Create default columns
        BoardColumn.objects.create(board=board, name="To Do", order=1)
        BoardColumn.objects.create(board=board, name="In Progress", order=2)
        BoardColumn.objects.create(board=board, name="Done", order=3)

class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer
    
    def get_queryset(self):
        return Sprint.objects.filter(project__in=ProjectViewSet(request=self.request).get_queryset())

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProjectManagerOrAdmin()]
        return [IsAuthenticated()]

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    
    def get_queryset(self):
        return Board.objects.filter(project__in=ProjectViewSet(request=self.request).get_queryset())

class BoardColumnViewSet(viewsets.ModelViewSet):
    serializer_class = BoardColumnSerializer
    
    def get_queryset(self):
        return BoardColumn.objects.filter(board__project__in=ProjectViewSet(request=self.request).get_queryset())
