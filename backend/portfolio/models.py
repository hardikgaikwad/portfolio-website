"""
Portfolio models.

Provides the data layer for all portfolio content: profile, projects,
skills, social links, resume, and site-wide settings.
"""

import os
from django.db import models
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator


def project_image_path(instance, filename):
    """Upload project images to media/projects/<slug>/"""
    ext = os.path.splitext(filename)[1]
    return f'projects/{instance.slug}{ext}'


def resume_upload_path(instance, filename):
    """Upload resume to media/resume/"""
    ext = os.path.splitext(filename)[1]
    return f'resume/resume{ext}'


class Profile(models.Model):
    """
    Singleton model for the portfolio owner's profile.
    Only one instance should exist.
    """
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200, help_text='e.g. Cybersecurity Engineer / Developer')
    subtitle = models.CharField(
        max_length=300,
        blank=True,
        help_text='e.g. CYBERSECURITY • SOFTWARE ENGINEERING • OFFENSIVE SECURITY'
    )
    bio = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    resume_file = models.FileField(
        upload_to=resume_upload_path,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        help_text='Upload resume (PDF, DOC, DOCX)'
    )
    # Focus areas displayed in the About section
    focus_areas = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of focus areas, e.g. ["Offensive Security", "Web Security"]'
    )
    currently_doing = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of current activities, e.g. ["Building", "Learning"]'
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profile'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Ensure only one Profile exists
        if not self.pk and Profile.objects.exists():
            existing = Profile.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


class Project(models.Model):
    """A portfolio project."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    long_description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to=project_image_path,
        blank=True,
        null=True,
        help_text='Project screenshot or thumbnail'
    )
    technologies = models.JSONField(
        default=list,
        help_text='JSON array of technology names, e.g. ["Django", "React", "PostgreSQL"]'
    )
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    documentation_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False, help_text='Show on homepage')
    display_order = models.IntegerField(default=0, help_text='Lower numbers appear first')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    # Optional detailed fields
    security_category = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=200, blank=True)
    highlights = models.JSONField(default=list, blank=True, help_text='Key feature highlights')
    challenges = models.TextField(blank=True)
    architecture = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class SkillCategory(models.Model):
    """A grouping of related skills (e.g. Languages, Security, Frameworks)."""

    name = models.CharField(max_length=100)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name


class Skill(models.Model):
    """An individual skill belonging to a category."""

    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        SkillCategory,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f'{self.name} ({self.category.name})'


class SocialLink(models.Model):
    """A social media or contact link."""

    PLATFORM_CHOICES = [
        ('github', 'GitHub'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('email', 'Email'),
        ('hackthebox', 'HackTheBox'),
        ('tryhackme', 'TryHackMe'),
        ('website', 'Website'),
        ('other', 'Other'),
    ]

    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    label = models.CharField(max_length=100, blank=True, help_text='Display label override')
    url = models.CharField(max_length=500, help_text='URL or email address')
    icon = models.CharField(max_length=50, blank=True, help_text='Icon identifier')
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f'{self.get_platform_display()}: {self.url}'


class SiteSettings(models.Model):
    """
    Singleton model for site-wide configuration.
    Controls terminal welcome message, site metadata, etc.
    """
    site_title = models.CharField(max_length=200, default='Portfolio Terminal')
    terminal_welcome = models.TextField(
        blank=True,
        help_text='Custom terminal welcome/boot message'
    )
    meta_description = models.CharField(max_length=500, blank=True)
    footer_text = models.CharField(max_length=300, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_title

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            existing = SiteSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)
