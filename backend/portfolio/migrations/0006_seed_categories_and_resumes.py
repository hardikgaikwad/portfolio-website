from django.db import migrations

def seed_categories_and_resumes(apps, schema_editor):
    ProjectCategory = apps.get_model('portfolio', 'ProjectCategory')
    Project = apps.get_model('portfolio', 'Project')
    Profile = apps.get_model('portfolio', 'Profile')

    # Seed Project Categories
    cat_sec, _ = ProjectCategory.objects.get_or_create(
        slug='security',
        defaults={
            'name': 'Security',
            'display_order': 1,
            'is_active': True,
        }
    )
    cat_soft, _ = ProjectCategory.objects.get_or_create(
        slug='software-development',
        defaults={
            'name': 'Software Development',
            'display_order': 2,
            'is_active': True,
        }
    )

    # Link existing projects
    mapping = {
        'privshare': [cat_sec, cat_soft],
        'xsscan': [cat_sec],
        'securemailscope': [cat_sec],
        'cybersecurity-lab': [cat_sec],
        'getpyqjec': [cat_soft],
        'eventregistration': [cat_soft],
    }

    for slug, cats in mapping.items():
        for p in Project.objects.filter(slug=slug):
            p.categories.add(*cats)

    # Also check any projects by project_type
    for p in Project.objects.filter(project_type__in=['security', 'research', 'lab']):
        p.categories.add(cat_sec)
    for p in Project.objects.filter(project_type__in=['software', 'fullstack']):
        p.categories.add(cat_soft)

    # Update Profile default resume URLs if empty
    for prof in Profile.objects.all():
        if not prof.resume_security_url:
            prof.resume_security_url = '/resumes/cybersecurity.pdf'
        if not prof.resume_software_url:
            prof.resume_software_url = '/resumes/software-development.pdf'
        prof.save()


def unseed_categories_and_resumes(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0005_projectcategory_profile_resume_security_url_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_categories_and_resumes, unseed_categories_and_resumes),
    ]
