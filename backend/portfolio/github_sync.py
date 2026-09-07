"""
GitHub repository synchronization service.

Fetches public repository data and READMEs from github.com/hardikgaikwad
and synchronizes with the portfolio database.
"""

import re
import json
import logging
import urllib.request
import urllib.error
from django.conf import settings
from django.utils.text import slugify
from .models import Project

logger = logging.getLogger(__name__)

GITHUB_USERNAME = 'hardikgaikwad'
REPOS_API_URL = f'https://api.github.com/users/{GITHUB_USERNAME}/repos'


def _get_github_headers():
    headers = {'User-Agent': 'Portfolio-Sync-Engine/1.0'}
    token = getattr(settings, 'GITHUB_TOKEN', '')
    if token:
        headers['Authorization'] = f'Bearer {token}'
    return headers


def fetch_github_repos():
    """Fetch repository list from GitHub API."""
    req = urllib.request.Request(
        REPOS_API_URL,
        headers=_get_github_headers()
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data
    except Exception as e:
        logger.warning("Error fetching GitHub repos: %s", e)
    return []


def fetch_repo_readme(repo_name):
    """Fetch raw README.md for a repository."""
    # Security: Ensure repo_name contains only valid GitHub repository characters
    if not repo_name or not re.match(r'^[a-zA-Z0-9._-]+$', str(repo_name)):
        logger.warning("Invalid repo name format rejected: %r", repo_name)
        return ''

    for branch in ['main', 'master']:
        url = f'https://raw.githubusercontent.com/{GITHUB_USERNAME}/{repo_name}/{branch}/README.md'
        try:
            req = urllib.request.Request(url, headers=_get_github_headers())
            with urllib.request.urlopen(req, timeout=6) as response:
                if response.status == 200:
                    return response.read().decode('utf-8')
        except Exception:
            continue
    return ''



def sync_github_projects(auto_publish_featured=True):
    """
    Synchronize repositories into Project database.
    Updates existing projects without overwriting custom presentation overrides.
    """
    repos = fetch_github_repos()
    synced_results = []

    # Map of project classifications
    project_type_map = {
        'PrivShare': 'security',
        'XSScan': 'security',
        'getpyqjec': 'software',
        'EventRegistration': 'software',
        'neetcode-submissions': 'software',
    }

    # Security category metadata
    security_cat_map = {
        'PrivShare': 'Cryptography / E2EE',
        'XSScan': 'Vulnerability Scanning / AppSec',
        'getpyqjec': 'Full-Stack Web Engineering',
    }

    featured_repos = {'PrivShare', 'XSScan', 'getpyqjec'}

    for repo in repos:
        name = repo.get('name')
        if name == GITHUB_USERNAME:
            continue  # Skip profile README repo

        html_url = repo.get('html_url')
        description = repo.get('description') or ''
        language = repo.get('language') or ''
        stars = repo.get('stargazers_count', 0)
        slug = slugify(name)

        # Check if project exists
        project = Project.objects.filter(github_url=html_url).first() or \
                  Project.objects.filter(slug=slug).first() or \
                  Project.objects.filter(title__iexact=name).first()

        readme_content = fetch_repo_readme(name)
        techs = []
        if language:
            techs.append(language)
        if repo.get('topics'):
            techs.extend(repo.get('topics'))

        if not project:
            # Create new project
            is_feat = (name in featured_repos) if auto_publish_featured else False
            proj_type = project_type_map.get(name, 'software')
            sec_cat = security_cat_map.get(name, 'Software Development')

            project = Project(
                title=name,
                slug=slug,
                short_description=description or f'{name} repository from GitHub.',
                long_description=readme_content[:1500] if readme_content else description,
                github_url=html_url,
                technologies=techs,
                featured=is_feat,
                project_type=proj_type,
                security_category=sec_cat,
                repo_name=f'{GITHUB_USERNAME}/{name}',
                github_stars=stars,
                is_github_synced=True,
                status='active',
            )
            project.save()
            synced_results.append({'name': name, 'action': 'created', 'status': 'success'})
        else:
            # Update existing project metadata while preserving manual curation
            project.github_stars = stars
            project.repo_name = f'{GITHUB_USERNAME}/{name}'
            project.is_github_synced = True
            if not project.github_url:
                project.github_url = html_url
            if readme_content and not project.long_description:
                project.long_description = readme_content[:1500]
            project.save()
            synced_results.append({'name': name, 'action': 'updated', 'status': 'success'})

    return synced_results
