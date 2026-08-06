from rest_framework import serializers
from .models import Task, TaskComment, TaskAttachment, TimeLog
from users.serializers import UserSerializer

class TaskCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'author', 'content', 'created_at']
        read_only_fields = ['author']

class TaskAttachmentSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskAttachment
        fields = ['id', 'task', 'uploader', 'file', 'uploaded_at']
        read_only_fields = ['uploader']

class TimeLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TimeLog
        fields = ['id', 'task', 'user', 'hours_logged', 'date_logged', 'description', 'created_at']
        read_only_fields = ['user']

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    reporter = UserSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ['id', 'project', 'sprint', 'column', 'assignee', 'assignee_id', 'reporter', 'title', 'description', 'priority', 'story_points', 'created_at', 'updated_at']
        read_only_fields = ['reporter']

    def create(self, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        task = Task.objects.create(**validated_data)
        if assignee_id:
            task.assignee_id = assignee_id
            task.save()
        return task
