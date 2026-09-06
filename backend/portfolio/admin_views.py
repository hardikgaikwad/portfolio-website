"""
Admin API views for the portfolio.

These endpoints require JWT authentication and admin (staff) privileges.
Provides full CRUD for all portfolio content.
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.conf import settings

from .models import Profile, Project, SkillCategory, Skill, SocialLink, SiteSettings
from .serializers import (
    ProfileAdminSerializer,
    ProjectAdminSerializer,
    ProjectDetailSerializer,
    SkillCategoryAdminSerializer,
    SkillSerializer,
    SocialLinkSerializer,
    SiteSettingsSerializer,
)
from .permissions import IsAdminUser


# ──────────────────────────────────────────────────────────────
# Profile Management
# ──────────────────────────────────────────────────────────────

class AdminProfileView(APIView):
    """
    GET  /api/admin/profile/ — Retrieve profile
    PUT  /api/admin/profile/ — Update profile
    """
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name='Your Name', title='Your Title')
        serializer = ProfileAdminSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name='Your Name', title='Your Title')
        serializer = ProfileAdminSerializer(
            profile, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ──────────────────────────────────────────────────────────────
# Project Management
# ──────────────────────────────────────────────────────────────

class AdminProjectListView(generics.ListCreateAPIView):
    """
    GET  /api/admin/projects/ — List all projects (including archived)
    POST /api/admin/projects/ — Create a new project
    """
    permission_classes = [IsAdminUser]
    serializer_class = ProjectAdminSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Project.objects.all()


class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/projects/<id>/ — Get project
    PUT    /api/admin/projects/<id>/ — Full update
    PATCH  /api/admin/projects/<id>/ — Partial update
    DELETE /api/admin/projects/<id>/ — Delete project
    """
    permission_classes = [IsAdminUser]
    serializer_class = ProjectAdminSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Project.objects.all()


# ──────────────────────────────────────────────────────────────
# Skills Management
# ──────────────────────────────────────────────────────────────

class AdminSkillCategoryListView(generics.ListCreateAPIView):
    """
    GET  /api/admin/skills/ — List all skill categories with skills
    POST /api/admin/skills/ — Create a new skill category (with optional nested skills)
    """
    permission_classes = [IsAdminUser]
    serializer_class = SkillCategoryAdminSerializer
    queryset = SkillCategory.objects.prefetch_related('skills').all()


class AdminSkillCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/skills/<id>/ — Get category
    PUT    /api/admin/skills/<id>/ — Update category (replaces skills if provided)
    DELETE /api/admin/skills/<id>/ — Delete category and all its skills
    """
    permission_classes = [IsAdminUser]
    serializer_class = SkillCategoryAdminSerializer
    queryset = SkillCategory.objects.prefetch_related('skills').all()


# ──────────────────────────────────────────────────────────────
# Social Links Management
# ──────────────────────────────────────────────────────────────

class AdminSocialLinkListView(generics.ListCreateAPIView):
    """
    GET  /api/admin/social/ — List all social links
    POST /api/admin/social/ — Create a new social link
    """
    permission_classes = [IsAdminUser]
    serializer_class = SocialLinkSerializer
    queryset = SocialLink.objects.all()


class AdminSocialLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/social/<id>/ — Get link
    PUT    /api/admin/social/<id>/ — Update link
    DELETE /api/admin/social/<id>/ — Delete link
    """
    permission_classes = [IsAdminUser]
    serializer_class = SocialLinkSerializer
    queryset = SocialLink.objects.all()


# ──────────────────────────────────────────────────────────────
# Resume Upload
# ──────────────────────────────────────────────────────────────

class AdminResumeUploadView(APIView):
    """
    POST /api/admin/resume/ — Upload a new resume file
    """
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume_file = request.FILES.get('resume_file')
        if not resume_file:
            return Response(
                {'detail': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size
        max_size = getattr(settings, 'MAX_UPLOAD_SIZE', 10 * 1024 * 1024)
        if resume_file.size > max_size:
            return Response(
                {'detail': f'File too large. Maximum size is {max_size // (1024*1024)}MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file type
        allowed_extensions = ['pdf', 'doc', 'docx']
        ext = resume_file.name.rsplit('.', 1)[-1].lower() if '.' in resume_file.name else ''
        if ext not in allowed_extensions:
            return Response(
                {'detail': f'Invalid file type. Allowed: {", ".join(allowed_extensions)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(name='Your Name', title='Your Title')

        # Delete old resume file if exists
        if profile.resume_file:
            profile.resume_file.delete(save=False)

        profile.resume_file = resume_file
        profile.save()

        serializer = ProfileAdminSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────────────────────
# Site Settings Management
# ──────────────────────────────────────────────────────────────

class AdminSiteSettingsView(APIView):
    """
    GET /api/admin/site-settings/ — Retrieve settings
    PUT /api/admin/site-settings/ — Update settings
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            obj = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            obj = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
