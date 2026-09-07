"""
Portfolio models.

Provides the data layer for all portfolio content: profile, projects,
skills, social links, resume, and site-wide settings.
"""

import os
import re
from django.db import models
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator, RegexValidator


def project_image_path(instance, filename):
    """Upload project images to media/projects/<slug>/"""
    ext = os.path.splitext(filename)[1]
    return f'projects/{instance.slug}{ext}'


def resume_upload_path(instance, filename):
    """Upload resume to media/resume/"""
    ext = os.path.splitext(filename)[1]
    return f'resume/resume{ext}'


def resume_security_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'resume/hardik_gaikwad_cybersecurity{ext}'


def resume_software_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'resume/hardik_gaikwad_software{ext}'


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
    resume_security = models.FileField(
        upload_to=resume_security_upload_path,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        help_text='Upload Cybersecurity Resume'
    )
    resume_security_url = models.CharField(
        max_length=500,
        blank=True,
        default='/resumes/cybersecurity.pdf',
        help_text='Direct accessible URL for Cybersecurity resume. Can be a local path (/resumes/cybersecurity.pdf) or external URL.'
    )
    resume_software = models.FileField(
        upload_to=resume_software_upload_path,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        help_text='Upload Software Engineering Resume'
    )
    resume_software_url = models.CharField(
        max_length=500,
        blank=True,
        default='/resumes/software-development.pdf',
        help_text='Direct accessible URL for Software Development resume. Can be a local path (/resumes/software-development.pdf) or external URL.'
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
    education = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of education records'
    )
    certifications = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of certifications'
    )
    volunteering = models.JSONField(
        default=list,
        blank=True,
        help_text='JSON array of volunteering activities'
    )
    about_terminal_content = models.TextField(
        blank=True,
        help_text='Content shown by "cat about.txt" in the terminal. Editable from Admin.'
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


class ProjectCategory(models.Model):
    """Dynamic project filter / category manageable through Django Admin."""
    name = models.CharField(max_length=100, help_text="Filter name, e.g. 'Security', 'Software Development'")
    slug = models.SlugField(max_length=100, unique=True, help_text="Slug identifier, e.g. 'security', 'software-development'")
    display_order = models.IntegerField(default=0, help_text="Order in which filter appears in the UI")
    is_active = models.BooleanField(default=True, help_text="Whether filter is visible in the frontend")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Project Filter / Category'
        verbose_name_plural = 'Project Filters / Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
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
    
    PROJECT_TYPE_CHOICES = [
        ('security', 'Security / Pentesting'),
        ('software', 'Software Engineering'),
        ('fullstack', 'Full Stack'),
        ('research', 'Research & Exploitation'),
        ('lab', 'Lab / Virtual Environment'),
        ('other', 'Other'),
    ]
    project_type = models.CharField(
        max_length=50,
        choices=PROJECT_TYPE_CHOICES,
        default='security',
        help_text='Classification track for portfolio filtering'
    )
    categories = models.ManyToManyField(
        ProjectCategory,
        related_name='projects',
        blank=True,
        help_text='Dynamic categories / filters associated with this project'
    )
    repo_name = models.CharField(
        max_length=150,
        blank=True,
        help_text='GitHub repository name (e.g. hardikgaikwad/PrivShare)'
    )
    github_stars = models.IntegerField(default=0)
    is_github_synced = models.BooleanField(default=False)
    # Terminal filesystem fields
    terminal_filename = models.CharField(
        max_length=100,
        blank=True,
        help_text='Virtual filename in terminal ~/projects/ (e.g. privshare.txt). '
                  'Auto-generated from slug if left blank.',
        validators=[RegexValidator(
            regex=r'^[a-zA-Z0-9][a-zA-Z0-9._-]*\.txt$',
            message='Filename must end with .txt, contain only letters, digits, dots, hyphens, '
                    'underscores, and not start with a dot or dash.'
        )]
    )
    terminal_content = models.TextField(
        blank=True,
        help_text='Full text content shown by "cat projects/<filename>" in the terminal. '
                  'If blank, auto-generated from project fields.'
    )
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
        # Auto-generate terminal_filename from slug if not set
        if not self.terminal_filename:
            self.terminal_filename = f'{self.slug}.txt'
        # Sanitize: strip path traversal characters
        self.terminal_filename = re.sub(r'[/\\]', '', self.terminal_filename)
        if self.terminal_filename.startswith('.'):
            self.terminal_filename = self.terminal_filename.lstrip('.')
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


class Education(models.Model):
    """An education record displayed in the terminal and portfolio."""

    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200, help_text='e.g. B.Tech — Information Technology')
    period = models.CharField(max_length=100, help_text='e.g. 2023–2027')
    grade = models.CharField(
        max_length=100,
        blank=True,
        help_text='e.g. CGPA: 7.69/10 or Class XII: 90.8%'
    )
    location = models.CharField(max_length=200, blank=True)
    display_order = models.IntegerField(default=0, help_text='Lower numbers appear first')

    class Meta:
        ordering = ['display_order']
        verbose_name_plural = 'Education'

    def __str__(self):
        return f'{self.institution} — {self.degree}'


class Certification(models.Model):
    """A certification/credential displayed in the terminal and portfolio."""

    title = models.CharField(max_length=200, help_text='e.g. eJPT')
    issuer = models.CharField(max_length=200, blank=True, help_text='e.g. INE Security')
    status = models.CharField(
        max_length=100,
        blank=True,
        help_text='e.g. Certified, Global Top 4%'
    )
    description = models.TextField(
        blank=True,
        help_text='Detailed text shown in terminal (completed paths, skills, etc.)'
    )
    url = models.URLField(blank=True, help_text='Optional verification or profile URL')
    display_order = models.IntegerField(default=0, help_text='Lower numbers appear first')

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.title
