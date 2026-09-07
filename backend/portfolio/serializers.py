"""
Portfolio serializers.

Handles serialization/deserialization for all portfolio models,
including nested representations for skill categories.
"""

from rest_framework import serializers
from .models import (
    Profile, Project, ProjectCategory, SkillCategory, Skill,
    SocialLink, SiteSettings, Education, Certification
)


# ── Project Categories / Filters ───────────────────────────

class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'slug', 'display_order', 'is_active']


# ── Education & Certification ──────────────────────────────

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'period', 'grade', 'location', 'display_order']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuer', 'status', 'description', 'url', 'display_order']


# ── Profile ────────────────────────────────────────────────

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
            'about_terminal_content',
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
        if getattr(obj, 'resume_security_url', None):
            return obj.resume_security_url
        return '/resumes/cybersecurity.pdf'

    def get_resume_software_url(self, obj):
        if obj.resume_software:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_software.url)
            return obj.resume_software.url
        if getattr(obj, 'resume_software_url', None):
            return obj.resume_software_url
        return '/resumes/software-development.pdf'


class ProfileAdminSerializer(serializers.ModelSerializer):
    """Admin serializer that includes file fields for uploads and URL overrides."""
    resume_url = serializers.SerializerMethodField(read_only=True)
    resume_security_url = serializers.CharField(required=False, allow_blank=True)
    resume_software_url = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'name', 'title', 'subtitle', 'bio', 'email',
            'location', 'focus_areas', 'currently_doing',
            'education', 'certifications', 'volunteering',
            'about_terminal_content',
            'resume_file', 'resume_security', 'resume_software',
            'resume_security_url', 'resume_software_url',
            'resume_url', 'updated_at'
        ]

    def get_resume_url(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.resume_security:
            data['resume_security_url'] = request.build_absolute_uri(instance.resume_security.url) if request else instance.resume_security.url
        elif not data.get('resume_security_url'):
            data['resume_security_url'] = '/resumes/cybersecurity.pdf'

        if instance.resume_software:
            data['resume_software_url'] = request.build_absolute_uri(instance.resume_software.url) if request else instance.resume_software.url
        elif not data.get('resume_software_url'):
            data['resume_software_url'] = '/resumes/software-development.pdf'
        return data


# ── Projects ───────────────────────────────────────────────

class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project listings with dynamic category slugs."""
    category_slugs = serializers.SerializerMethodField()
    category_names = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'status',
            'technologies', 'image', 'github_url', 'live_url',
            'featured', 'display_order', 'security_category',
            'category_slugs', 'category_names', 'repo_name', 'github_stars'
        ]

    def get_category_slugs(self, obj):
        return list(obj.categories.values_list('slug', flat=True))

    def get_category_names(self, obj):
        return list(obj.categories.values_list('name', flat=True))


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for single project inspection / dossier."""
    category_slugs = serializers.SerializerMethodField()
    category_names = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description',
            'long_description', 'technologies', 'image',
            'security_category', 'category_slugs', 'category_names',
            'status', 'featured', 'display_order',
            'github_url', 'live_url', 'documentation_url',
            'repo_name', 'github_stars',
            'is_github_synced', 'role', 'highlights', 'challenges',
            'architecture', 'terminal_filename', 'terminal_content',
            'created_at', 'updated_at'
        ]

    def get_category_slugs(self, obj):
        return list(obj.categories.values_list('slug', flat=True))

    def get_category_names(self, obj):
        return list(obj.categories.values_list('name', flat=True))


class ProjectAdminSerializer(serializers.ModelSerializer):
    """Admin serializer with all writable fields."""
    category_slugs = serializers.SerializerMethodField(read_only=True)
    category_names = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


    def get_category_slugs(self, obj):
        return list(obj.categories.values_list('slug', flat=True))

    def get_category_names(self, obj):
        return list(obj.categories.values_list('name', flat=True))


# ── Skills ─────────────────────────────────────────────────

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


# ── Social Links ───────────────────────────────────────────

class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)

    class Meta:
        model = SocialLink
        fields = [
            'id', 'platform', 'platform_display', 'label',
            'url', 'icon', 'display_order'
        ]


# ── Site Settings ──────────────────────────────────────────

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_title', 'terminal_welcome',
            'meta_description', 'footer_text', 'updated_at'
        ]
