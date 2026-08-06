from rest_framework import serializers
from .models import Project, Sprint, Board, BoardColumn
from users.serializers import UserSerializer

class BoardColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardColumn
        fields = ['id', 'name', 'order', 'board']

class BoardSerializer(serializers.ModelSerializer):
    columns = BoardColumnSerializer(many=True, read_only=True)
    
    class Meta:
        model = Board
        fields = ['id', 'project', 'name', 'columns', 'created_at']

class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = ['id', 'project', 'name', 'start_date', 'end_date', 'is_active', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    board = BoardSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members', 'board', 'created_at', 'updated_at']
        read_only_fields = ['owner']
