# Root Skills

Root `.agents/skills/` is for repo-owned maintainer technique only.

Installed third-party skill mirrors are local tooling and are ignored by default. Do not commit a copied skill pack just because it helped during a session.

To commit a repo-owned skill:

1. name the skill explicitly in `.gitignore` with a matching `!/.agents/skills/<name>/` rule;
2. keep the skill specific to maintaining this repository;
3. do not confuse root maintainer skills with shipped seed skills under `templates/default/.agents/skills/`.

Create a root skill only when repeated work proves a reusable technique belongs in the repo.
