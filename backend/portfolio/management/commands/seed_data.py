"""
Management command to populate the database with placeholder portfolio data.

Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from portfolio.models import Profile, Project, SkillCategory, Skill, SocialLink, SiteSettings


class Command(BaseCommand):
    help = 'Seed the database with placeholder portfolio data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding portfolio data...')

        # ── Profile ─────────────────────────────────────────
        profile, created = Profile.objects.get_or_create(
            pk=1,
            defaults={
                'name': 'HARDIK',
                'title': 'Cybersecurity Engineer / Developer',
                'subtitle': 'CYBERSECURITY . SOFTWARE ENGINEERING . OFFENSIVE SECURITY',
                'bio': (
                    'Cybersecurity enthusiast and software engineer with a passion for '
                    'offensive security, web application security, and building secure systems. '
                    'Focused on identifying vulnerabilities and developing robust solutions '
                    'that protect digital infrastructure.'
                ),
                'email': 'hello@example.com',
                'location': 'India',
                'focus_areas': [
                    'Offensive Security',
                    'Web Application Security',
                    'Software Development',
                    'Network Security',
                ],
                'currently_doing': [
                    'Building secure applications',
                    'Learning advanced exploitation techniques',
                    'Exploring cloud security',
                ],
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('  [+] Profile created'))
        else:
            self.stdout.write('  [-] Profile already exists')

        # ── Projects ────────────────────────────────────────
        projects_data = [
            {
                'title': 'PrivShare',
                'slug': 'privshare',
                'short_description': 'Secure encrypted file-sharing platform with end-to-end encryption.',
                'long_description': (
                    'PrivShare is a secure file-sharing application that implements '
                    'AES-256-GCM encryption for all uploaded files. Built with Django '
                    'and Django REST Framework, it provides a clean API for file upload, '
                    'sharing via secure links, and automatic expiration of shared files.\n\n'
                    'Key security features include client-side encryption, secure key '
                    'derivation, and zero-knowledge architecture where the server never '
                    'has access to unencrypted files.'
                ),
                'technologies': ['Django', 'Django REST Framework', 'AES-256-GCM', 'PostgreSQL', 'React'],
                'github_url': 'https://github.com/yourusername/privshare',
                'live_url': '',
                'featured': True,
                'display_order': 1,
                'status': 'completed',
                'security_category': 'Cryptography',
                'role': 'Full-Stack Developer',
                'highlights': [
                    'End-to-end AES-256-GCM encryption',
                    'Zero-knowledge architecture',
                    'Automatic file expiration',
                    'Secure link sharing',
                ],
            },
            {
                'title': 'SecureMailScope',
                'slug': 'securemailscope',
                'short_description': 'Email security analysis tool for detecting phishing and header anomalies.',
                'long_description': (
                    'SecureMailScope analyzes email headers and content to identify '
                    'potential phishing attempts, spoofed senders, and suspicious '
                    'attachments. It performs SPF, DKIM, and DMARC validation, '
                    'URL reputation checking, and content analysis.\n\n'
                    'The tool provides a detailed security report with risk scores '
                    'and recommendations for each analyzed email.'
                ),
                'technologies': ['Python', 'Django', 'REST API', 'Email Parsing', 'Security Analysis'],
                'github_url': 'https://github.com/yourusername/securemailscope',
                'live_url': '',
                'featured': True,
                'display_order': 2,
                'status': 'completed',
                'security_category': 'Email Security',
                'role': 'Developer',
                'highlights': [
                    'SPF/DKIM/DMARC validation',
                    'Phishing detection engine',
                    'URL reputation analysis',
                    'Detailed security reports',
                ],
            },
            {
                'title': 'GetPyQJEC',
                'slug': 'getpyqjec',
                'short_description': 'Automated previous year question paper retrieval system.',
                'long_description': (
                    'GetPyQJEC is an automated system for retrieving and organizing '
                    'previous year question papers. Built with Python, it scrapes, '
                    'categorizes, and serves question papers through a clean web interface.\n\n'
                    'Features include subject-wise organization, search functionality, '
                    'and bulk download capabilities.'
                ),
                'technologies': ['Python', 'Django', 'Web Scraping', 'PostgreSQL', 'HTML/CSS'],
                'github_url': 'https://github.com/yourusername/getpyqjec',
                'live_url': '',
                'featured': True,
                'display_order': 3,
                'status': 'completed',
                'security_category': '',
                'role': 'Full-Stack Developer',
                'highlights': [
                    'Automated paper retrieval',
                    'Subject-wise categorization',
                    'Search and filter functionality',
                    'Bulk download support',
                ],
            },
            {
                'title': 'NetRecon',
                'slug': 'netrecon',
                'short_description': 'Network reconnaissance and vulnerability scanning toolkit.',
                'long_description': (
                    'NetRecon is a network reconnaissance toolkit that automates '
                    'common information gathering tasks during penetration testing. '
                    'It integrates with tools like Nmap and provides structured '
                    'output for further analysis.'
                ),
                'technologies': ['Python', 'Nmap', 'Bash', 'Linux', 'Networking'],
                'github_url': 'https://github.com/yourusername/netrecon',
                'live_url': '',
                'featured': False,
                'display_order': 4,
                'status': 'in_progress',
                'security_category': 'Penetration Testing',
                'role': 'Developer',
                'highlights': [
                    'Automated reconnaissance',
                    'Nmap integration',
                    'Structured reporting',
                ],
            },
        ]

        for pdata in projects_data:
            project, created = Project.objects.get_or_create(
                slug=pdata['slug'],
                defaults=pdata
            )
            status_icon = '[+]' if created else '[-]'
            status_text = 'created' if created else 'already exists'
            self.stdout.write(f'  {status_icon} Project "{pdata["title"]}" {status_text}')

        # ── Skills ──────────────────────────────────────────
        skills_data = {
            'Languages': ['Python', 'C++', 'Bash', 'SQL', 'JavaScript', 'HTML', 'CSS'],
            'Security': ['Nmap', 'Burp Suite', 'OWASP ZAP', 'Metasploit', 'Wireshark', 'Splunk'],
            'Frameworks': ['Django', 'Django REST Framework', 'React', 'PostgreSQL', 'Flask'],
            'Systems': ['Linux', 'Windows', 'Docker', 'VMware', 'VirtualBox', 'Git'],
        }

        for order, (category_name, skill_names) in enumerate(skills_data.items()):
            category, created = SkillCategory.objects.get_or_create(
                name=category_name,
                defaults={'display_order': order}
            )
            if created:
                for s_order, skill_name in enumerate(skill_names):
                    Skill.objects.get_or_create(
                        name=skill_name,
                        category=category,
                        defaults={'display_order': s_order}
                    )
                self.stdout.write(self.style.SUCCESS(f'  [+] Skill category "{category_name}" created'))
            else:
                self.stdout.write(f'  [-] Skill category "{category_name}" already exists')

        # ── Social Links ────────────────────────────────────
        social_data = [
            {'platform': 'github', 'url': 'https://github.com/yourusername', 'display_order': 0},
            {'platform': 'linkedin', 'url': 'https://linkedin.com/in/yourusername', 'display_order': 1},
            {'platform': 'email', 'url': 'hello@example.com', 'display_order': 2},
        ]

        for sdata in social_data:
            link, created = SocialLink.objects.get_or_create(
                platform=sdata['platform'],
                defaults=sdata
            )
            status_icon = '[+]' if created else '[-]'
            status_text = 'created' if created else 'already exists'
            self.stdout.write(f'  {status_icon} Social link "{sdata["platform"]}" {status_text}')

        # ── Site Settings ───────────────────────────────────
        settings_obj, created = SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                'site_title': 'HARDIK // Portfolio Terminal',
                'terminal_welcome': '',
                'meta_description': 'Cybersecurity engineer and software developer portfolio.',
                'footer_text': 'CYBERSECURITY . SOFTWARE . SYSTEMS',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('  [+] Site settings created'))
        else:
            self.stdout.write('  [-] Site settings already exist')

        self.stdout.write(self.style.SUCCESS('\nSeed data complete.'))
