"""
Public API views for the portfolio.

These endpoints are read-only and accessible without authentication.
"""

from django.shortcuts import redirect
from django.http import Http404
from django.db import connection
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .models import (
    Profile, Project, ProjectCategory, SkillCategory, SocialLink,
    SiteSettings, Education, Certification
)
from .serializers import (
    ProfileSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectCategorySerializer,
    SkillCategorySerializer,
    SocialLinkSerializer,
    SiteSettingsSerializer,
    EducationSerializer,
    CertificationSerializer,
)


class ProjectCategoryListView(generics.ListAPIView):
    """
    GET /api/project-filters/
    Returns active project categories/filters ordered by display_order.
    """
    permission_classes = [AllowAny]
    serializer_class = ProjectCategorySerializer

    def get_queryset(self):
        return ProjectCategory.objects.filter(is_active=True)


class ResumeDownloadView(APIView):
    """
    GET /api/resumes/<track>/
    Direct accessible endpoint that redirects to the active resume resource.
    """
    permission_classes = [AllowAny]

    def get(self, request, track):
        profile = Profile.objects.first()
        if not profile:
            raise Http404("Profile not found")

        track_lower = track.lower()
        if 'sec' in track_lower:
            url = profile.resume_security_url or '/resumes/cybersecurity.pdf'
            if profile.resume_security:
                url = request.build_absolute_uri(profile.resume_security.url)
        elif 'soft' in track_lower or 'dev' in track_lower:
            url = profile.resume_software_url or '/resumes/software-development.pdf'
            if profile.resume_software:
                url = request.build_absolute_uri(profile.resume_software.url)
        else:
            url = profile.resume_security_url or '/resumes/cybersecurity.pdf'

        return redirect(url)


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


class EducationListView(generics.ListAPIView):
    """
    GET /api/education/
    Returns all education records, ordered by display_order.
    """
    permission_classes = [AllowAny]
    serializer_class = EducationSerializer
    queryset = Education.objects.all()


class CertificationListView(generics.ListAPIView):
    """
    GET /api/certifications/
    Returns all certification records, ordered by display_order.
    """
    permission_classes = [AllowAny]
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()


class HealthCheckView(APIView):
    """
    GET /api/health/
    Health check endpoint that tests application responsiveness and database connectivity.
    Ideal for Koyeb / UptimeRobot keep-alive pings.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
            return Response(
                {"status": "healthy", "database": "connected"},
                status=status.HTTP_200_OK
            )
        except Exception as exc:
            return Response(
                {"status": "unhealthy", "database": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

