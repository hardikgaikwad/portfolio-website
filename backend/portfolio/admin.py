"""
Django admin configuration for portfolio models.

Provides a bonus admin interface via Django's built-in admin at /django-admin/.
"""

from django.contrib import admin
from .models import (
    Profile, Project, ProjectCategory, SkillCategory, Skill, SocialLink,
    SiteSettings, Education, Certification
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'updated_at')
    fieldsets = (
        ('Personal Info', {
            'fields': ('name', 'title', 'subtitle', 'bio', 'email', 'location')
        }),
        ('Terminal — About', {
            'fields': ('about_terminal_content',),
            'description': 'Content displayed when running "cat about.txt" in the terminal.',
        }),
        ('Resume Files & URLs', {
            'fields': (
                'resume_security', 'resume_security_url',
                'resume_software', 'resume_software_url',
                'resume_file',
            ),
            'description': 'Manage Cybersecurity and Software Development resumes via uploaded files or direct URLs (e.g. /resumes/... or external links).',
        }),
        ('Profile Data (JSON)', {
            'fields': ('focus_areas', 'currently_doing', 'education', 'certifications', 'volunteering'),
            'classes': ('collapse',),
            'description': 'Legacy JSON fields. Prefer the dedicated Education & Certification models for terminal content.',
        }),
    )


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'is_active', 'project_count')
    list_editable = ('display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('display_order', 'name')

    def project_count(self, obj):
        return obj.projects.count()
    project_count.short_description = 'Associated Projects'


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'terminal_filename', 'featured', 'display_order', 'status', 'created_at')
    list_filter = ('featured', 'status', 'project_type', 'categories')
    list_editable = ('featured', 'display_order', 'status')
    filter_horizontal = ('categories',)
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')
    fieldsets = (
        ('Project Info', {
            'fields': ('title', 'slug', 'short_description', 'long_description', 'image',
                       'technologies', 'github_url', 'live_url', 'documentation_url')
        }),
        ('Terminal Filesystem', {
            'fields': ('terminal_filename', 'terminal_content'),
            'description': (
                'Controls how this project appears in the terminal virtual filesystem. '
                'terminal_filename is the name shown in ~/projects/ (auto-generated from slug if blank). '
                'terminal_content is what "cat projects/<filename>" displays (auto-generated from project fields if blank).'
            ),
        }),
        ('Classification & Display', {
            'fields': ('featured', 'categories', 'display_order', 'status', 'project_type',
                       'security_category', 'role')
        }),
        ('GitHub Integration', {
            'fields': ('repo_name', 'github_stars', 'is_github_synced'),
            'classes': ('collapse',),
        }),
        ('Extended Details', {
            'fields': ('highlights', 'challenges', 'architecture'),
            'classes': ('collapse',),
        }),
    )


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_order')
    list_editable = ('display_order',)
    inlines = [SkillInline]


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'display_order')
    list_editable = ('display_order',)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_title', 'updated_at')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'degree', 'period', 'grade', 'display_order')
    list_editable = ('display_order',)
    ordering = ('display_order',)


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'status', 'display_order')
    list_editable = ('display_order',)
    ordering = ('display_order',)
