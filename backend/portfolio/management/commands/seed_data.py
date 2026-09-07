"""
Management command to populate the database with authoritative portfolio data
derived from Hardik Gaikwad's cybersecurity and software engineering resumes and GitHub.

Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from portfolio.models import Profile, Project, SkillCategory, Skill, SocialLink, SiteSettings


class Command(BaseCommand):
    help = 'Seed database with authoritative resume and project data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding authoritative portfolio data...')

        # ── Profile ─────────────────────────────────────────
        profile_data = {
            'name': 'Hardik Gaikwad',
            'title': 'Cybersecurity Engineer & Software Developer',
            'subtitle': 'BUILD IT. BREAK IT. SECURE IT. — OFFENSIVE SECURITY & BACKEND ENGINEERING',
            'bio': (
                'Cybersecurity researcher and software engineer with a deep passion for offensive security, '
                'web application penetration testing, and architecting resilient backend systems. '
                'eJPT-certified with top 4% global ranking on TryHackMe, actively bridging the gap between '
                'vulnerability discovery and secure software development.'
            ),
            'email': 'hardikgaikwad04@gmail.com',
            'location': 'Jabalpur, India',
            'focus_areas': [
                'Web Application Penetration Testing',
                'Network Enumeration & Pivoting',
                'Offensive Security & Exploitation',
                'Zero-Knowledge Cryptography & Secure Storage',
                'Python & Django REST Architecture',
                'Threat Analysis & OWASP Mitigation',
            ],
            'currently_doing': [
                'Pursuing B.Tech in IT at Jabalpur Engineering College (CGPA: 7.69)',
                'Ranking in Global Top 4% on TryHackMe penetration testing labs',
                'Developing automated security scanners and distributed web tools',
                'Preparing advanced penetration testing certifications and vulnerability research',
            ],
            'education': [
                {
                    'institution': 'Jabalpur Engineering College',
                    'degree': 'B.Tech in Information Technology',
                    'period': '2023 – 2027',
                    'grade': 'CGPA: 7.69 (up to 6th Semester)',
                    'location': 'Jabalpur, India',
                },
                {
                    'institution': 'Bal Bhavan School — CBSE',
                    'degree': 'Senior Secondary (Class XII & X)',
                    'period': 'Completed',
                    'grade': 'Class XII: 90.8% | Class X: 90.2%',
                    'location': 'Bhopal, India',
                }
            ],
            'certifications': [
                {
                    'title': 'eJPT (eLearnSecurity Junior Penetration Tester)',
                    'issuer': 'eLearnSecurity / INE Security',
                    'type': 'Professional Certification',
                    'description': (
                        'Conducted full kill-chain penetration tests across multiple network services, '
                        'executing reconnaissance, enumeration, vulnerability identification, exploitation, '
                        'and post-exploitation in segmented lab environments. Performed credential attacks, '
                        'misconfiguration exploitation, privilege escalation, and lateral movement via pivoting.'
                    ),
                },
                {
                    'title': 'TryHackMe Security Learning Paths',
                    'issuer': 'TryHackMe',
                    'type': 'Global Top 4%',
                    'description': (
                        'Ranked in the global top 4% on TryHackMe. Completed Pre Security, Cyber Security 101, '
                        'and Jr Penetration Tester paths covering networking fundamentals, exploitation techniques, '
                        'and web application security.'
                    ),
                }
            ],
            'volunteering': [
                {
                    'organization': 'VulnCon - Security Conference',
                    'role': 'Core Team Member & Media Lead',
                    'description': (
                        'Contributed to video editing and media content creation, served as the point of contact '
                        'between the Media and Social Media teams, guided photographers and videographers for '
                        'event coverage, and supported on-site event coordination.'
                    ),
                }
            ]
        }

        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(pk=1, **profile_data)
            self.stdout.write(self.style.SUCCESS('  [+] Profile created'))
        else:
            for k, v in profile_data.items():
                setattr(profile, k, v)
            profile.save()
            self.stdout.write(self.style.SUCCESS('  [+] Profile updated with resume facts'))

        # ── Projects ────────────────────────────────────────
        projects_data = [
            {
                'title': 'PrivShare',
                'slug': 'privshare',
                'short_description': 'Zero-knowledge encrypted file sharing with client-side AES-GCM-256 and AWS S3.',
                'long_description': (
                    'PrivShare is a secure, ephemeral file-sharing web application. Upload any file up to 200MB, '
                    'receive a single share code, and share it securely. Files are encrypted on the client side using '
                    'AES-GCM-256 before upload via pycryptodome; the server never receives or stores the decryption key.\n\n'
                    'Offloaded encrypted blob storage to AWS S3 via django-storages and served streamed downloads as '
                    'StreamingHttpResponse, supporting files up to 200MB without loading into server memory. Access is secured '
                    'with UUID4 tokens against IDOR attacks, GCM authentication tags for tamper detection, and automated '
                    '6-hour file expiry via background tasks.'
                ),
                'technologies': [
                    'Python', 'Django', 'Django REST Framework', 'PostgreSQL',
                    'AWS S3', 'Streamlit', 'AES-GCM-256', 'pycryptodome'
                ],
                'github_url': 'https://github.com/hardikgaikwad/PrivShare',
                'live_url': 'https://privshare.streamlit.app/',
                'featured': True,
                'display_order': 1,
                'status': 'active',
                'project_type': 'security',
                'security_category': 'Cryptography / E2EE',
                'repo_name': 'hardikgaikwad/PrivShare',
                'role': 'Lead Architect & Security Engineer',
                'highlights': [
                    'Built a zero-knowledge file-sharing app with client-side AES-GCM-256 E2EE using pycryptodome.',
                    'Offloaded encrypted blob storage to AWS S3, streaming downloads up to 200MB without memory overhead.',
                    'Secured access with UUID4 tokens against IDOR attacks, GCM authentication tags for tamper detection.',
                    'Automated 6-hour file expiration and secure storage purge.',
                ],
                'architecture': 'Client Browser (AES-GCM-256 Encryption) ──> Django REST API ──> AWS S3 Storage Bucket ──> 6h Ephemeral Lifecycle',
                'challenges': 'Designing a high-throughput streaming download pipeline that guarantees GCM tag verification without exhausting server memory on large blobs.',
            },
            {
                'title': 'XSScan',
                'slug': 'xsscan',
                'short_description': 'Context-aware reflected XSS scanner with DOM tree response verification.',
                'long_description': (
                    'XSScan is an automated, asynchronous vulnerability scanner built in Python to detect server-side reflected '
                    'Cross-Site Scripting (XSS). It systematically discovers domain-scoped targets and fuzzes GET/POST input '
                    'vectors using context-specific payloads tailored for HTML, JavaScript, SVG, and attribute contexts.\n\n'
                    'Engineered a resilient detection engine that parses HTTP responses into DOM trees to guarantee injected '
                    'payloads execute unescaped in the browser context. Built a scalable testing pipeline with configurable '
                    'rate limiting, connection pooling, and custom header support for assessing authenticated endpoints. '
                    'Tested extensively against OWASP Mutillidae II.'
                ),
                'technologies': [
                    'Python', 'AsyncIO', 'HTTP Protocol', 'DOM Analysis', 'OWASP Mutillidae II'
                ],
                'github_url': 'https://github.com/hardikgaikwad/XSScan',
                'live_url': '',
                'featured': True,
                'display_order': 2,
                'status': 'active',
                'project_type': 'security',
                'security_category': 'AppSec & Pentesting',
                'repo_name': 'hardikgaikwad/XSScan',
                'role': 'Security Tool Developer',
                'highlights': [
                    'Automated async vulnerability scanner mapping domain-scoped targets with GET/POST vector fuzzing.',
                    'Context-specific payload generation tailored for HTML, JS, SVG, and attribute reflection contexts.',
                    'DOM tree parsing engine to confirm unescaped execution and prevent false positives.',
                    'Configurable rate-limiting, connection pooling, and authenticated session header support.',
                ],
                'architecture': 'Target Discovery ──> Parameter Fuzzing Engine ──> Context Payloads ──> HTTP Async Pipeline ──> DOM Execution Verification',
                'challenges': 'Eliminating false-positive reflected strings by inspecting the actual DOM parse tree to verify unescaped execution capability.',
            },
            {
                'title': 'GetPYQJEC',
                'slug': 'getpyqjec',
                'short_description': 'Crowd-sourced Previous Year Question Paper compilation platform with on-demand PDF generation.',
                'long_description': (
                    'GetPYQJEC is a student-built crowd-sourced platform to access and compile Previous Year Question Papers. '
                    'Led backend development in a team to build a centralized platform organizing academic resources across '
                    'college branches, semesters, and subjects.\n\n'
                    'Architected a Django REST API supporting structured metadata and file-management workflows for the React '
                    'frontend. Implemented on-demand PDF compilation with pikepdf, allowing users to generate subject-wise or '
                    'semester-wise question paper bundles by year range without manual compilation.'
                ),
                'technologies': [
                    'Django', 'Django REST Framework', 'React', 'Vite', 'PostgreSQL', 'Supabase', 'pikepdf'
                ],
                'github_url': 'https://github.com/hardikgaikwad/getpyqjec',
                'live_url': '',
                'featured': True,
                'display_order': 3,
                'status': 'active',
                'project_type': 'software',
                'security_category': 'Full-Stack Software',
                'repo_name': 'hardikgaikwad/getpyqjec',
                'role': 'Backend Lead & API Architect',
                'highlights': [
                    'Led backend development in a team to centralize Previous Year Question Papers for the entire college.',
                    'Designed and implemented Django REST API supporting structured metadata and file-management workflows.',
                    'Implemented on-demand PDF compilation using pikepdf, eliminating manual student compilation.',
                    'React (Vite) frontend with branch, semester, and year-range filtering.',
                ],
                'architecture': 'React Frontend ──> Django REST API ──> PostgreSQL / Supabase ──> On-demand pikepdf compiler ──> Compiled PDF Bundle',
                'challenges': 'Fast on-demand PDF stitching and compression across multiple year batches without latency bottlenecks.',
            },
            {
                'title': 'Home Cybersecurity Lab & Network Simulation',
                'slug': 'cybersecurity-lab',
                'short_description': 'Virtualized network lab with segmented attacker/target subnets, pfSense routing, and VulnHub machines.',
                'long_description': (
                    'Built a virtualized enterprise network security lab using VMware and pfSense as firewall and router '
                    'to simulate segmented attacker and target networks. Deployed vulnerable environments including VulnHub '
                    'machines, OWASP Broken Web Applications, and DVWA alongside a Kali Linux attacker machine to perform '
                    'end-to-end penetration testing, including network enumeration, vulnerability exploitation, and privilege escalation.'
                ),
                'technologies': [
                    'pfSense', 'Kali Linux', 'VMware', 'VirtualBox',
                    'VulnHub', 'OWASP BWA', 'DVWA', 'Nmap', 'Metasploit', 'Wireshark'
                ],
                'github_url': '',
                'live_url': '',
                'featured': True,
                'display_order': 4,
                'status': 'active',
                'project_type': 'lab',
                'security_category': 'Network & Lab Environment',
                'repo_name': '',
                'role': 'Network & Security Architect',
                'highlights': [
                    'Configured pfSense router/firewall with isolated VLANs simulating corporate network segmentation.',
                    'Deployed vulnerable enterprise targets (VulnHub, OWASP BWA, DVWA) alongside Kali Linux attacker VM.',
                    'Conducted hands-on kill-chain exercises: reconnaissance, enumeration, exploitation, and pivoting.',
                    'Analyzed packet captures in Wireshark to correlate attacker signatures with defensive telemetry.',
                ],
                'architecture': 'Kali Linux (Attacker VM) ──> pfSense Firewall / Router ──> Segmented Target Subnets (VulnHub / OWASP / DVWA)',
                'challenges': 'Configuring routing rules and NAT across subnets to enable realistic attacker pivoting while preventing host system leakage.',
            },
        ]

        for p_data in projects_data:
            project, created = Project.objects.update_or_create(
                slug=p_data['slug'],
                defaults=p_data
            )
            action = 'created' if created else 'updated'
            self.stdout.write(self.style.SUCCESS(f'  [+] Project "{project.title}" {action}'))

        # ── Skills ──────────────────────────────────────────
        skills_structure = {
            'Languages': [
                'Python', 'C++', 'JavaScript', 'Bash', 'SQL', 'HTML', 'CSS'
            ],
            'Security Tools': [
                'Burp Suite', 'Metasploit', 'Nmap', 'Hydra', 'Gobuster', 'Nikto', 'OWASP ZAP', 'Wfuzz'
            ],
            'Frameworks & Libraries': [
                'Django', 'Django REST Framework', 'React', 'Vite', 'Streamlit', 'pikepdf'
            ],
            'Databases & Cloud': [
                'PostgreSQL', 'Supabase', 'AWS S3', 'Cloudinary'
            ],
            'Platforms & Environments': [
                'Linux', 'Windows', 'macOS', 'VMware', 'VirtualBox', 'Git', 'Docker'
            ],
            'Security Concepts': [
                'OWASP Top 10', 'Web Application Pentesting', 'Network Enumeration',
                'Exploitation', 'Privilege Escalation', 'Threat Analysis',
                'Secure API Design', 'Lateral Movement & Pivoting'
            ]
        }

        # Clear existing categories to rebuild cleanly
        SkillCategory.objects.all().delete()

        for cat_order, (cat_name, skills_list) in enumerate(skills_structure.items(), 1):
            category = SkillCategory.objects.create(name=cat_name, display_order=cat_order)
            for skill_order, skill_name in enumerate(skills_list, 1):
                Skill.objects.create(category=category, name=skill_name, display_order=skill_order)
            self.stdout.write(self.style.SUCCESS(f'  [+] Skill category "{cat_name}" created ({len(skills_list)} skills)'))

        # ── Social Links ────────────────────────────────────
        social_links = [
            {
                'platform': 'github',
                'label': 'GitHub',
                'url': 'https://github.com/hardikgaikwad',
                'icon': 'github',
                'display_order': 1,
            },
            {
                'platform': 'linkedin',
                'label': 'LinkedIn',
                'url': 'https://linkedin.com/in/hardikgaikwad',
                'icon': 'linkedin',
                'display_order': 2,
            },
            {
                'platform': 'email',
                'label': 'Email Dispatch',
                'url': 'mailto:hardikgaikwad04@gmail.com',
                'icon': 'email',
                'display_order': 3,
            },
        ]

        SocialLink.objects.all().delete()
        for s_data in social_links:
            SocialLink.objects.create(**s_data)
            self.stdout.write(self.style.SUCCESS(f'  [+] Social link "{s_data["platform"]}" configured'))

        # ── Site Settings ───────────────────────────────────
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults={
                'site_title': 'Hardik Gaikwad // Cybersecurity Engineer & Full-Stack Developer',
                'terminal_welcome': 'Hardik Gaikwad Portfolio Workstation v2.5.0\nType "help" to view commands.',
                'meta_description': 'Personal portfolio of Hardik Gaikwad: Cybersecurity researcher, eJPT certified, and full-stack software engineer.',
                'footer_text': 'HARDIK GAIKWAD. ALL SYSTEMS MONITORED & SECURED.',
            }
        )
        self.stdout.write(self.style.SUCCESS('  [+] Site settings verified'))

        self.stdout.write(self.style.SUCCESS('\nAuthoritative seed data complete.'))
