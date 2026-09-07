"""
Comprehensive security, permissions, and functional test suite for the portfolio backend.
"""

import io
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Profile, Project, ProjectCategory, SkillCategory, Skill,
    SocialLink, SiteSettings, Education, Certification
)


class SecurityAndPermissionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='SuperSecretAdminPassword123!'
        )

        # Create standard non-staff user
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='RegularUserPassword123!'
        )

        # Generate JWT tokens
        admin_refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(admin_refresh.access_token)

        regular_refresh = RefreshToken.for_user(self.regular_user)
        self.regular_token = str(regular_refresh.access_token)

        # Create initial seed data
        self.profile, _ = Profile.objects.get_or_create(
            defaults={
                'name': 'Hardik Gaikwad',
                'title': 'Cybersecurity Engineer',
                'resume_security_url': '/resumes/cybersecurity.pdf',
                'resume_software_url': '/resumes/software-development.pdf',
            }
        )

        self.category, _ = ProjectCategory.objects.get_or_create(
            slug='security',
            defaults={
                'name': 'Security',
                'display_order': 1,
                'is_active': True,
            }
        )

        self.project, _ = Project.objects.get_or_create(
            slug='xsscan',
            defaults={
                'title': 'XSScan',
                'short_description': 'Cross-Site Scripting Scanner',
                'status': 'active',
                'featured': True,
                'display_order': 1,
            }
        )
        self.project.categories.add(self.category)


    # ── Public Endpoints: Read-Only Enforcement ────────────────────────────

    def test_public_endpoints_accessible_to_unauthenticated_users(self):
        """Public API endpoints must be accessible without authentication."""
        endpoints = [
            '/api/profile/',
            '/api/projects/',
            f'/api/projects/{self.project.slug}/',
            '/api/skills/',
            '/api/social/',
            '/api/education/',
            '/api/certifications/',
            '/api/project-filters/',
            '/api/site-settings/',
            '/api/health/',
        ]
        for url in endpoints:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_public_endpoints_reject_state_modifications(self):
        """Public endpoints must reject POST/PUT/PATCH/DELETE with 405 Method Not Allowed."""
        disallowed_actions = [
            ('/api/projects/', 'post', {'title': 'Hacked'}),
            ('/api/profile/', 'put', {'name': 'Hacked'}),
            (f'/api/projects/{self.project.slug}/', 'delete', {}),
        ]
        for url, method, data in disallowed_actions:
            with self.subTest(url=url, method=method):
                client_method = getattr(self.client, method)
                response = client_method(url, data=data, format='json')
                self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # ── Admin Endpoints: Authorization & Access Control ────────────────────

    def test_admin_endpoints_reject_unauthenticated_requests(self):
        """Unauthenticated requests to admin endpoints must return 401 Unauthorized."""
        admin_urls = [
            ('/api/admin/profile/', 'get'),
            ('/api/admin/projects/', 'get'),
            ('/api/admin/projects/', 'post'),
            (f'/api/admin/projects/{self.project.id}/', 'put'),
            (f'/api/admin/projects/{self.project.id}/', 'delete'),
            ('/api/admin/skills/', 'get'),
            ('/api/admin/social/', 'get'),
            ('/api/admin/resume/', 'post'),
            ('/api/admin/github/sync/', 'post'),
            ('/api/admin/site-settings/', 'get'),
        ]
        for url, method in admin_urls:
            with self.subTest(url=url, method=method):
                client_method = getattr(self.client, method)
                response = client_method(url)
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_endpoints_reject_non_staff_authenticated_users(self):
        """Authenticated users without staff status must receive 403 Forbidden."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.regular_token}')
        admin_urls = [
            ('/api/admin/profile/', 'get'),
            ('/api/admin/projects/', 'get'),
            ('/api/admin/skills/', 'get'),
            ('/api/admin/social/', 'get'),
            ('/api/admin/site-settings/', 'get'),
        ]
        for url, method in admin_urls:
            with self.subTest(url=url, method=method):
                client_method = getattr(self.client, method)
                response = client_method(url)
                self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_endpoints_accessible_to_staff_user(self):
        """Authenticated staff users must be granted access to admin endpoints."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get('/api/admin/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Hardik Gaikwad')

        response = self.client.get('/api/admin/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ── Health Check: Error Sanitization ───────────────────────────────────

    def test_health_check_basic(self):
        """Basic health check returns 200 without touching database."""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'healthy')

    # ── Resume Download: Safe Redirection ──────────────────────────────────

    def test_resume_download_safe_redirect(self):
        """Resume download safely redirects to configured relative path."""
        response = self.client.get('/api/resumes/security/')
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, '/resumes/cybersecurity.pdf')

        response = self.client.get('/api/resumes/software/')
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, '/resumes/software-development.pdf')

    def test_resume_download_neutralizes_unsafe_schemes(self):
        """If an unsafe URL scheme is configured, the view falls back safely to default PDF."""
        self.profile.resume_security_url = 'javascript:alert(1)'
        self.profile.save()

        response = self.client.get('/api/resumes/security/')
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, '/resumes/cybersecurity.pdf')

    # ── Resume Upload: Validation & Signature Verification ─────────────────

    def test_resume_upload_valid_pdf_accepted(self):
        """A valid PDF file with %PDF- header is accepted."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        valid_pdf_content = b'%PDF-1.4\n%test valid pdf payload\n%%EOF'
        pdf_file = SimpleUploadedFile(
            name='test_resume.pdf',
            content=valid_pdf_content,
            content_type='application/pdf'
        )

        response = self.client.post(
            '/api/admin/resume/',
            data={'resume_file': pdf_file, 'resume_type': 'security'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_resume_upload_rejects_non_pdf_extension(self):
        """Uploading non-PDF files (e.g. .exe, .sh, .docx) must be rejected."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        fake_file = SimpleUploadedFile(
            name='malicious.sh',
            content=b'echo "pwnd"',
            content_type='text/x-shellscript'
        )

        response = self.client.post(
            '/api/admin/resume/',
            data={'resume_file': fake_file, 'resume_type': 'security'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Only PDF documents are allowed', response.data['detail'])

    def test_resume_upload_rejects_spoofed_pdf_magic_bytes(self):
        """Files with .pdf extension but missing %PDF- header must be rejected."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        spoofed_file = SimpleUploadedFile(
            name='fake.pdf',
            content=b'<html><script>alert(1)</script></html>',
            content_type='application/pdf'
        )

        response = self.client.post(
            '/api/admin/resume/',
            data={'resume_file': spoofed_file, 'resume_type': 'security'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Corrupted or invalid PDF document', response.data['detail'])
