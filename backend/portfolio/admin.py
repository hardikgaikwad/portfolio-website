"""
Django admin configuration for portfolio models.

Provides a bonus admin interface via Django's built-in admin at /django-admin/.
"""

from django.contrib import admin
from .models import Profile, Project, SkillCategory, Skill, SocialLink, SiteSettings


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'updated_at')


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'featured', 'display_order', 'status', 'created_at')
    list_filter = ('featured', 'status')
    list_editable = ('featured', 'display_order', 'status')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')


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
