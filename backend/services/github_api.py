import os
import requests
from datetime import datetime, timedelta

def get_repos(username):
    url = f'https://api.github.com/users/{username}/repos?per_page=100'
    token = os.getenv('GITHUB_TOKEN')
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'
    try:
        r = requests.get(url, timeout=10, headers=headers)
        if r.status_code != 200:
            return []
        return r.json()
    except Exception:
        return []


def get_languages(username, repos):
    counts = {}
    for repo in repos:
        lang = repo.get('language') or 'Unknown'
        counts[lang] = counts.get(lang, 0) + 1
    return counts


def get_commit_activity(username, repos):
    now = datetime.utcnow()
    start_dt = now - timedelta(days=6)
    since = start_dt.isoformat() + 'Z'
    start_date = start_dt.date()
    counts = [0] * 7
    repo_counts = {}
    token = os.getenv('GITHUB_TOKEN')
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'

    for repo in repos:
        name = repo.get('name')
        if not name:
            continue
        url = f'https://api.github.com/repos/{username}/{name}/commits'
        params = {'since': since, 'per_page': 100}
        try:
            r = requests.get(url, params=params, timeout=10, headers=headers)
            if r.status_code != 200:
                continue
            commits = r.json()
            repo_total = 0
            for c in commits:
                dstr = c.get('commit', {}).get('author', {}).get('date')
                if not dstr:
                    continue
                try:
                    d = datetime.strptime(dstr, '%Y-%m-%dT%H:%M:%SZ').date()
                except:
                    try:
                        d = datetime.fromisoformat(dstr.replace('Z', '+00:00')).date()
                    except:
                        continue
                delta = (d - start_date).days
                if 0 <= delta < 7:
                    counts[delta] += 1
                    repo_total += 1
            if repo_total:
                repo_counts[name] = repo_counts.get(name, 0) + repo_total
        except:
            continue
    return counts, repo_counts


def get_user_profile(username):
    """Fetch basic user profile info from GitHub and return (profile_dict, status_code).

    status_code will be 200 on success; otherwise 404 (not found), 403 (rate limit), or other upstream code.
    """
    url = f'https://api.github.com/users/{username}'
    token = os.getenv('GITHUB_TOKEN')
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'
    try:
        r = requests.get(url, timeout=10, headers=headers)
        if r.status_code != 200:
            return None, r.status_code
        u = r.json()
        return ({
            'avatar_url': u.get('avatar_url'),
            'name': u.get('name'),
            'bio': u.get('bio'),
            'location': u.get('location'),
            'followers': u.get('followers', 0),
            'following': u.get('following', 0),
            'public_repos': u.get('public_repos', 0),
            'html_url': u.get('html_url')
        }, 200)
    except Exception:
        return None, 500


def _auth_headers():
    token = os.getenv('GITHUB_TOKEN')
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'
    return headers


def get_followers(username):
    url = f'https://api.github.com/users/{username}/followers?per_page=100'
    try:
        r = requests.get(url, timeout=10, headers=_auth_headers())
        if r.status_code != 200:
            return [], r.status_code
        users = r.json()
        data = [
            {
                'login': u.get('login'),
                'avatar_url': u.get('avatar_url'),
                'html_url': u.get('html_url')
            } for u in users if u.get('login')
        ]
        return data, 200
    except Exception:
        return [], 500


def get_following(username):
    url = f'https://api.github.com/users/{username}/following?per_page=100'
    try:
        r = requests.get(url, timeout=10, headers=_auth_headers())
        if r.status_code != 200:
            return [], r.status_code
        users = r.json()
        data = [
            {
                'login': u.get('login'),
                'avatar_url': u.get('avatar_url'),
                'html_url': u.get('html_url')
            } for u in users if u.get('login')
        ]
        return data, 200
    except Exception:
        return [], 500


def get_user_repos_list(username):
    """Return a simplified list of repos with key fields for display."""
    repos = get_repos(username)
    result = []
    for r in repos:
        result.append({
            'name': r.get('name'),
            'html_url': r.get('html_url'),
            'description': r.get('description'),
            'stargazers_count': r.get('stargazers_count', 0),
            'forks_count': r.get('forks_count', 0),
            'language': r.get('language')
        })
    return result


def get_readme(username, repo):
    """Fetch README content for a repo. Returns (text, status_code)."""
    url = f'https://api.github.com/repos/{username}/{repo}/readme'
    headers = _auth_headers()
    try:
        r = requests.get(url, timeout=10, headers=headers)
        if r.status_code == 200:
            data = r.json()
            content = data.get('content')
            encoding = data.get('encoding')
            if content and encoding == 'base64':
                import base64
                try:
                    text = base64.b64decode(content).decode('utf-8', errors='replace')
                except Exception:
                    text = ''
            else:
                text = ''
            return text, 200
        if r.status_code == 404:
            return '', 404
        if r.status_code == 403:
            return '', 403
        return '', r.status_code
    except Exception:
        return '', 500
