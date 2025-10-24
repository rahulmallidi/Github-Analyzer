from flask import Flask, jsonify
from flask_cors import CORS
from services.github_api import (
    get_repos,
    get_languages,
    get_commit_activity,
    get_user_profile,
    get_followers,
    get_following,
    get_user_repos_list,
    get_readme
)
import os

app = Flask(__name__)
CORS(app)

# Root route to avoid 404
@app.route('/')
def home():
    return """
    <h1>GitHub Analyzer API</h1>
    <p>Use the following endpoints:</p>
    <ul>
        <li>/analyze/&lt;username&gt;</li>
        <li>/followers/&lt;username&gt;</li>
        <li>/following/&lt;username&gt;</li>
        <li>/repos/&lt;username&gt;</li>
        <li>/readme/&lt;username&gt;/&lt;repo&gt;</li>
    </ul>
    """

@app.route('/analyze/<username>')
def analyze(username):
    profile, pcode = get_user_profile(username)
    if pcode == 403:
        return jsonify({"error": "Rate limited by GitHub API"}), 429
    if pcode == 404:
        return jsonify({"error": "User not found"}), 404
    if pcode != 200 or not profile:
        return jsonify({"error": "Upstream error"}), 502

    repos = get_repos(username)
    total_repos = len(repos)
    languages = get_languages(username, repos)
    commit_activity, repo_commit_counts = get_commit_activity(username, repos)
    most_active_repo = max(repo_commit_counts, key=repo_commit_counts.get) if repo_commit_counts else ""

    stars_per_repo = []
    forks_per_repo = []
    repo_commits = []
    total_commits = 0
    for repo in repos:
        name = repo.get('name')
        if not name:
            continue
        stars = repo.get('stargazers_count', 0)
        forks = repo.get('forks_count', 0)
        stars_per_repo.append({"name": name, "stars": stars})
        forks_per_repo.append({"name": name, "forks": forks})
        commits = repo_commit_counts.get(name, 0)
        repo_commits.append({"name": name, "commits": commits})
        total_commits += commits

    avg_commits_per_repo = (total_commits / total_repos) if total_repos > 0 else 0

    return jsonify({
        "profile": profile,
        "total_repos": total_repos,
        "most_active_repo": most_active_repo,
        "languages": languages,
        "commit_activity": commit_activity,
        "stars_per_repo": stars_per_repo,
        "forks_per_repo": forks_per_repo,
        "avg_commits_per_repo": avg_commits_per_repo,
        "repo_commits": repo_commits
    })

@app.route('/followers/<username>')
def followers(username):
    users, code = get_followers(username)
    if code == 403:
        return jsonify({"error": "Rate limited by GitHub API"}), 429
    if code == 404:
        return jsonify({"error": "User not found"}), 404
    if code != 200:
        return jsonify({"error": "Upstream error"}), 502
    return jsonify(users)

@app.route('/following/<username>')
def following(username):
    users, code = get_following(username)
    if code == 403:
        return jsonify({"error": "Rate limited by GitHub API"}), 429
    if code == 404:
        return jsonify({"error": "User not found"}), 404
    if code != 200:
        return jsonify({"error": "Upstream error"}), 502
    return jsonify(users)

@app.route('/repos/<username>')
def repos(username):
    profile, pcode = get_user_profile(username)
    if pcode == 403:
        return jsonify({"error": "Rate limited by GitHub API"}), 429
    if pcode == 404:
        return jsonify({"error": "User not found"}), 404
    if pcode != 200:
        return jsonify({"error": "Upstream error"}), 502
    repos = get_user_repos_list(username)
    return jsonify(repos)

@app.route('/readme/<username>/<repo>')
def readme(username, repo):
    text, code = get_readme(username, repo)
    if code == 403:
        return jsonify({"error": "Rate limited by GitHub API"}), 429
    if code == 404:
        return jsonify({"error": "README not found"}), 404
    if code != 200:
        return jsonify({"error": "Upstream error"}), 502
    return jsonify({"readme": text})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's port
    app.run(host="0.0.0.0", port=port)
