from django.db import migrations

def seed_terminal_data(apps, schema_editor):
    Education = apps.get_model('portfolio', 'Education')
    Certification = apps.get_model('portfolio', 'Certification')
    Project = apps.get_model('portfolio', 'Project')

    # Seed Education
    if not Education.objects.exists():
        Education.objects.create(
            institution="Jabalpur Engineering College (JEC)",
            degree="B.Tech in Information Technology",
            period="2023 – 2027",
            grade="CGPA: 7.69 (up to 6th Semester)",
            location="Jabalpur, Madhya Pradesh, India",
            display_order=1,
        )
        Education.objects.create(
            institution="Bal Bhavan School — CBSE",
            degree="Senior Secondary (XII) & Secondary (X)",
            period="2021 – 2023",
            grade="Class XII: 90.8% | Class X: 90.2%",
            location="Bhopal, Madhya Pradesh, India",
            display_order=2,
        )

    # Seed Certifications
    if not Certification.objects.exists():
        Certification.objects.create(
            title="eJPT (eLearnSecurity Junior Penetration Tester)",
            issuer="eLearnSecurity / INE Security",
            status="Active / Certified",
            description="Full kill-chain network pentesting, reconnaissance, privilege escalation, lateral pivoting across segmented networks.",
            display_order=1,
        )
        Certification.objects.create(
            title="TryHackMe Security Learning Paths",
            issuer="TryHackMe",
            status="Global Top 4%",
            description="Pre Security, Cyber Security 101, Jr Penetration Tester learning paths completed.",
            url="https://tryhackme.com",
            display_order=2,
        )

    # Update project terminal filenames
    filename_map = {
        'cybersecurity-lab': 'home-lab.txt',
        'eventregistration': 'eventregistration.txt',
        'getpyqjec': 'getpyqjec.txt',
        'privshare': 'privshare.txt',
        'securemailscope': 'securemailscope.txt',
        'xsscan': 'xsscan.txt',
    }
    for slug, filename in filename_map.items():
        Project.objects.filter(slug=slug).update(terminal_filename=filename)


def unseed_terminal_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_certification_education_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_terminal_data, unseed_terminal_data),
    ]
