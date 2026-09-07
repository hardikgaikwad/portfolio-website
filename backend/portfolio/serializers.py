"""
Portfolio serializers.

Handles serialization/deserialization for all portfolio models,
including nested representations for skill categories.
"""

from rest_framework import serializers
from .models import Profile, Project, SkillCategory, Skill, SocialLink, SiteSettings


class ProfileSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    resume_security_url = serializers.SerializerMethodField()
    resume_software_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'name', 'title', 'subtitle', 'bio', 'email',
            'location', 'focus_areas', 'currently_doing',
            'education', 'certifications', 'volunteering',
            'resume_url', 'resume_security_url', 'resume_software_url',
            'updated_at'
        ]

    def get_resume_url(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None

    def get_resume_security_url(self, obj):
        if obj.resume_security:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_security.url)
            return obj.resume_security.url
        return None

    def get_resume_software_url(self, obj):
        if obj.resume_software:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_software.url)
            return obj.resume_software.url
        return None


class ProfileAdminSerializer(serializers.ModelSerializer):
    """Admin serializer that includes file fields for uploads."""
    resume_url = serializers.SerializerMethodField(read_only=True)
    resume_security_url = serializers.SerializerMethodField(read_only=True)
    resume_software_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'name', 'title', 'subtitle', 'bio', 'email',
            'location', 'focus_areas', 'currently_doing',
            'education', 'certifications', 'volunteering',
            'resume_file', 'resume_security', 'resume_software',
            'resume_url', 'resume_security_url', 'resume_software_url',
            'updated_at'
        ]

    def get_resume_url(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None

    def get_resume_security_url(self, obj):
        if obj.resume_security:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_security.url)
            return obj.resume_security.url
        return None

    def get_resume_software_url(self, obj):
        if obj.resume_software:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_software.url)
            return obj.resume_software.url
        return None


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project listings."""

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'image',
            'technologies', 'github_url', 'live_url', 'featured',
            'display_order', 'status', 'project_type', 'security_category',
            'repo_name', 'github_stars', 'is_github_synced', 'created_at'
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full serializer for project detail views."""

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'long_description',
            'image', 'technologies', 'github_url', 'live_url',
            'documentation_url', 'featured', 'display_order', 'status',
            'project_type', 'security_category', 'repo_name', 'github_stars',
            'is_github_synced', 'role', 'highlights', 'challenges',
            'architecture', 'created_at', 'updated_at'
        ]


class ProjectAdminSerializer(serializers.ModelSerializer):
    """Admin serializer with all writable fields."""

    class Meta:
        model = Project
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'display_order']


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'display_order', 'skills']


class SkillCategoryAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for creating/updating skill categories with nested skills."""
    skills = SkillSerializer(many=True, required=False)

    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'display_order', 'skills']

    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        category = SkillCategory.objects.create(**validated_data)
        for skill_data in skills_data:
            Skill.objects.create(category=category, **skill_data)
        return category

    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills', None)
        instance.name = validated_data.get('name', instance.name)
        instance.display_order = validated_data.get('display_order', instance.display_order)
        instance.save()

        if skills_data is not None:
            instance.skills.all().delete()
            for skill_data in skills_data:
                Skill.objects.create(category=instance, **skill_data)

        return instance


class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)

    class Meta:
        model = SocialLink
        fields = [
            'id', 'platform', 'platform_display', 'label',
            'url', 'icon', 'display_order'
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_title', 'terminal_welcome',
            'meta_description', 'footer_text', 'updated_at'
        ]
