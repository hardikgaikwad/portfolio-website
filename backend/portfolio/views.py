"""
Public API views for the portfolio.

These endpoints are read-only and accessible without authentication.
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .models import Profile, Project, SkillCategory, SocialLink, SiteSettings
from .serializers import (
    ProfileSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    SkillCategorySerializer,
    SocialLinkSerializer,
    SiteSettingsSerializer,
)


class ProfileView(APIView):
    """
    GET /api/profile/
    Returns the singleton profile.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            return Response(
                {'detail': 'Profile not configured.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)


class ProjectListView(generics.ListAPIView):
    """
    GET /api/projects/
    Returns all published projects, ordered by display_order.
    """
    permission_classes = [AllowAny]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = Project.objects.exclude(status='archived')
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(featured=True)
        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """
    GET /api/projects/<slug>/
    Returns a single project by slug.
    """
    permission_classes = [AllowAny]
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'
    queryset = Project.objects.all()


class SkillListView(generics.ListAPIView):
    """
    GET /api/skills/
    Returns all skill categories with nested skills.
    """
    permission_classes = [AllowAny]
    serializer_class = SkillCategorySerializer
    queryset = SkillCategory.objects.prefetch_related('skills').all()


class SocialLinkListView(generics.ListAPIView):
    """
    GET /api/social/
    Returns all social links.
    """
    permission_classes = [AllowAny]
    serializer_class = SocialLinkSerializer
    queryset = SocialLink.objects.all()


class SiteSettingsView(APIView):
    """
    GET /api/site-settings/
    Returns the singleton site settings.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            return Response(
                {'site_title': 'Portfolio Terminal', 'terminal_welcome': '', 'meta_description': '', 'footer_text': ''}
            )
        serializer = SiteSettingsSerializer(settings_obj)
        return Response(serializer.data)
