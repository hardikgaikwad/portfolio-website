"""
Portfolio URL configuration.

Maps API endpoints to views for both public and admin interfaces.
"""

from django.urls import path
from . import views, admin_views

urlpatterns = [
    # ── Public API ──────────────────────────────────────────
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('projects/', views.ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('skills/', views.SkillListView.as_view(), name='skill-list'),
    path('social/', views.SocialLinkListView.as_view(), name='social-list'),
    path('education/', views.EducationListView.as_view(), name='education-list'),
    path('certifications/', views.CertificationListView.as_view(), name='certification-list'),
    path('project-filters/', views.ProjectCategoryListView.as_view(), name='project-filter-list'),
    path('resumes/<str:track>/', views.ResumeDownloadView.as_view(), name='resume-download'),
    path('site-settings/', views.SiteSettingsView.as_view(), name='site-settings'),

    # ── Admin API ───────────────────────────────────────────
    path('admin/profile/', admin_views.AdminProfileView.as_view(), name='admin-profile'),
    path('admin/projects/', admin_views.AdminProjectListView.as_view(), name='admin-project-list'),
    path('admin/projects/<int:pk>/', admin_views.AdminProjectDetailView.as_view(), name='admin-project-detail'),
    path('admin/skills/', admin_views.AdminSkillCategoryListView.as_view(), name='admin-skill-list'),
    path('admin/skills/<int:pk>/', admin_views.AdminSkillCategoryDetailView.as_view(), name='admin-skill-detail'),
    path('admin/social/', admin_views.AdminSocialLinkListView.as_view(), name='admin-social-list'),
    path('admin/social/<int:pk>/', admin_views.AdminSocialLinkDetailView.as_view(), name='admin-social-detail'),
    path('admin/resume/', admin_views.AdminResumeUploadView.as_view(), name='admin-resume-upload'),
    path('admin/github/sync/', admin_views.AdminGitHubSyncView.as_view(), name='admin-github-sync'),
    path('admin/site-settings/', admin_views.AdminSiteSettingsView.as_view(), name='admin-site-settings'),
]
