#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def require_file(errors: list[str], path: str) -> Path:
    target = ROOT / path
    if not target.is_file():
        fail(errors, f"missing file: {path}")
    return target


def read(path: Path) -> str:
    try:
        return path.read_text()
    except FileNotFoundError:
        return ""


def extract_agent_paths(router_text: str) -> set[str]:
    return set(re.findall(r"`((?:\.agents|history)/[^`]+?\.md)`", router_text))


def extract_check_paths(text: str) -> set[str]:
    paths = set()
    for match in re.findall(r"(\.agents/checks/[A-Za-z0-9._/-]+)", text):
        path = match.rstrip(".,:;)")
        if path.endswith("/") or "*" in path:
            continue
        paths.add(path)
    return paths


def warn(warnings: list[str], message: str) -> None:
    warnings.append(message)


def check_router(errors: list[str]) -> None:
    router = require_file(errors, ".agents/router.md")
    text = read(router)

    for path in sorted(extract_agent_paths(text)):
        if "*" in path:
            continue
        if not (ROOT / path).is_file():
            fail(errors, f"router references missing file: {path}")

    for skill in re.findall(r"`([^`]+)`", text):
        if skill.startswith(".") or "/" in skill:
            continue
        skill_path = ROOT / ".agents" / "skills" / skill / "SKILL.md"
        if not skill_path.is_file():
            fail(errors, f"router references missing skill: {skill}")


def check_resolvers(errors: list[str], warnings: list[str]) -> None:
    required = [
        "## Trigger",
        "## Required Reads",
        "## Owned Surfaces",
        "## Allowed Writes",
        "## Non-Goals",
        "## Gate",
        "## Cold-Agent Test",
        "## Failure Signs",
    ]
    for path in sorted((ROOT / ".agents" / "resolvers").glob("*.md")):
        if path.name == "README.md":
            continue
        text = read(path)
        if re.search(r"^Status:\s+draft\b", text, re.MULTILINE):
            warn(warnings, f"{rel(path)} has stale draft status metadata")
        for marker in required:
            if marker not in text:
                fail(errors, f"{rel(path)} missing {marker}")
        gate_match = re.search(r"`(\.agents/gates/[^`]+\.md)`", text)
        if not gate_match:
            fail(errors, f"{rel(path)} does not name a gate path")
        elif not (ROOT / gate_match.group(1)).is_file():
            fail(errors, f"{rel(path)} names missing gate: {gate_match.group(1)}")


def check_gates(errors: list[str]) -> None:
    for path in sorted((ROOT / ".agents" / "gates").glob("*.md")):
        if path.name == "README.md":
            continue
        text = read(path)
        done_markers = ["Done means", "done only when", "Minimum gate"]
        if not any(marker in text for marker in done_markers):
            fail(errors, f"{rel(path)} does not state done criteria")
        for check_path in sorted(extract_check_paths(text)):
            if not (ROOT / check_path).is_file():
                fail(errors, f"{rel(path)} names missing check: {check_path}")


def check_commands(errors: list[str]) -> None:
    commands_root = ROOT / ".agents" / "commands"
    if not commands_root.is_dir():
        return
    for path in sorted(commands_root.iterdir()):
        if not path.is_file():
            continue
        text = read(path)
        for check_path in sorted(extract_check_paths(text)):
            if not (ROOT / check_path).is_file():
                fail(errors, f"{rel(path)} names missing check: {check_path}")


def check_skills(errors: list[str]) -> None:
    skills_root = ROOT / ".agents" / "skills"
    for skill_dir in sorted(path for path in skills_root.iterdir() if path.is_dir()):
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.is_file():
            fail(errors, f"skill missing SKILL.md: {rel(skill_dir)}")
            continue
        text = read(skill_md)
        if not text.startswith("---"):
            fail(errors, f"{rel(skill_md)} missing YAML frontmatter")
        if f"name: {skill_dir.name}" not in text:
            fail(errors, f"{rel(skill_md)} frontmatter name should match directory")
        if "description:" not in text.split("---", 2)[1]:
            fail(errors, f"{rel(skill_md)} missing description")


def read_json_object(errors: list[str], path: str) -> dict[str, object]:
    target = ROOT / path
    try:
        value = json.loads(target.read_text())
    except FileNotFoundError:
        fail(errors, f"missing file: {path}")
        return {}
    except json.JSONDecodeError as error:
        fail(errors, f"{path} is invalid JSON: {error}")
        return {}
    if not isinstance(value, dict):
        fail(errors, f"{path} must contain a JSON object")
        return {}
    return value


def locked_skill_paths(errors: list[str], lock_path: str) -> dict[str, str]:
    lock = read_json_object(errors, lock_path)

    skills = lock.get("skills")
    if not isinstance(skills, dict):
        fail(errors, f"{lock_path} missing skills object")
        return {}

    locked: dict[str, str] = {}
    for name, metadata in skills.items():
        if not isinstance(metadata, dict):
            fail(errors, f"{lock_path} entry is not an object: {name}")
            continue
        local_path = metadata.get("localPath") or f".agents/skills/{name}/SKILL.md"
        if not isinstance(local_path, str):
            fail(errors, f"{lock_path} localPath is not a string: {name}")
            continue
        computed_hash = metadata.get("computedHash")
        if not isinstance(computed_hash, str) or re.fullmatch(r"[0-9a-f]{64}", computed_hash) is None:
            fail(errors, f"{lock_path} computedHash is not 64 lowercase hex: {name}")
        locked[name] = local_path
    return locked


def repo_skill_manifest(
    errors: list[str],
) -> tuple[dict[str, object], dict[str, str], str]:
    path = ".agents/skills/manifest.json"
    manifest = read_json_object(errors, path)

    if manifest.get("version") != 1:
        fail(errors, f"{path} version must be 1")

    external_lock = manifest.get("externalLock")
    if external_lock != "skills-lock.json":
        fail(errors, f"{path} externalLock must be skills-lock.json")
        external_lock = "skills-lock.json"

    resolution = manifest.get("resolution")
    expected_resolution = {
        "repoDeclaredWins": True,
        "globalFallback": "undeclared-only",
        "externalBodies": "tracked-until-immutable-ref",
    }
    if not isinstance(resolution, dict):
        fail(errors, f"{path} missing resolution object")
    else:
        for key, expected in expected_resolution.items():
            if resolution.get(key) != expected:
                fail(errors, f"{path} resolution.{key} must be {json.dumps(expected)}")

    materialized = manifest.get("materializedImports")
    hashes: dict[str, str] = {}
    if not isinstance(materialized, dict):
        fail(errors, f"{path} missing materializedImports object")
    else:
        if materialized.get("algorithm") != "sha256-path-content-v1":
            fail(errors, f"{path} materializedImports.algorithm must be sha256-path-content-v1")
        raw_hashes = materialized.get("hashes")
        if not isinstance(raw_hashes, dict):
            fail(errors, f"{path} materializedImports missing hashes object")
        else:
            for name, value in raw_hashes.items():
                if not isinstance(value, str) or re.fullmatch(r"[0-9a-f]{64}", value) is None:
                    fail(errors, f"{path} materialization hash is not sha256 hex: {name}")
                    continue
                hashes[name] = value

    repo_skills = manifest.get("repoSkills")
    if not isinstance(repo_skills, dict):
        fail(errors, f"{path} missing repoSkills object")
        repo_skills = {}
    else:
        for name, metadata in repo_skills.items():
            if not isinstance(metadata, dict):
                fail(errors, f"{path} repoSkills entry is not an object: {name}")
                continue
            if metadata.get("ownership") not in {"seed", "repo", "adopted"}:
                fail(errors, f"{path} repoSkills ownership is invalid: {name}")

    agents_kit = repo_skills.get("agents-kit")
    if not isinstance(agents_kit, dict) or agents_kit.get("ownership") != "seed":
        fail(errors, f"{path} repoSkills.agents-kit ownership must be seed")

    return repo_skills, hashes, external_lock


def check_skill_inventory(errors: list[str]) -> None:
    skills_root = ROOT / ".agents" / "skills"
    repo_skills, hashes, external_lock = repo_skill_manifest(errors)
    locked = locked_skill_paths(errors, external_lock)
    if not skills_root.is_dir():
        return

    skill_dirs = {
        path.name: path
        for path in skills_root.iterdir()
        if path.is_dir()
    }

    for name, local_path in sorted(locked.items()):
        if not (ROOT / local_path).is_file():
            fail(errors, f"locked skill missing localPath: {name} -> {local_path}")
        if name not in hashes:
            fail(errors, f"externally locked skill missing materialization hash: {name}")

    for name in sorted(set(repo_skills) & set(locked)):
        fail(errors, f"skill is both repo-declared and externally locked: {name}")

    for name in sorted(repo_skills):
        if not (skills_root / name / "SKILL.md").is_file():
            fail(errors, f"repo-declared skill missing SKILL.md: .agents/skills/{name}")

    for name in sorted(hashes):
        if name not in locked:
            fail(errors, f"materialization hash has no externally locked skill: {name}")
        elif name not in skill_dirs:
            fail(errors, f"materialization hash has no local skill directory: {name}")

    for name in sorted(skill_dirs):
        if name not in locked and name not in repo_skills:
            fail(
                errors,
                f"skill has no manifest owner: .agents/skills/{name}",
            )


def check_control_plane(errors: list[str]) -> None:
    require_file(errors, "AGENTS.md")
    require_file(errors, ".agents/README.md")
    require_file(errors, ".agents/AGENT-CONTROL-PLANE.md")
    require_file(errors, ".agents/commands/README.md")
    require_file(errors, ".agents/checks/README.md")
    require_file(errors, "history/lessons/README.md")

    agents_text = read(ROOT / "AGENTS.md")
    if len(agents_text.splitlines()) > 90:
        fail(errors, "AGENTS.md is too large for a boot file")

    doctrine = read(ROOT / ".agents/AGENT-CONTROL-PLANE.md")
    for phrase in [
        "Lessons",
        "Artifacts",
        "Health",
        "Placement Test",
        "Rule of Thumb",
        "Commands And Checks",
        "Agents-Kit Scripts",
        "Skills",
    ]:
        if f"## {phrase}" not in doctrine:
            fail(errors, f".agents/AGENT-CONTROL-PLANE.md missing ## {phrase}")


def check_no_retired_runtime_state(errors: list[str]) -> None:
    retired_paths = [
        ".agents/active-work.md",
        ".agents/current-work.md",
        ".agents/skills/informal-active-work",
        ".agents/skills/ralph-loop",
        ".agents/skills/ralph-loop-repo",
        ".agents/skills/agents-kit/scripts/render-active-work.py",
        ".agents/skills/agents-kit/scripts/check-factory-state.py",
        ".agents/skills/agents-kit/scripts/test-factory-state.py",
    ]
    for path in retired_paths:
        if (ROOT / path).exists():
            fail(errors, f"retired runtime state still exists: {path}")


def check_lessons(errors: list[str]) -> None:
    old_root = ROOT / "history" / "learnings"
    if old_root.exists():
        fail(errors, "history/learnings is retired; use history/lessons for lesson artifacts")

    lessons_root = ROOT / "history" / "lessons"
    if not lessons_root.is_dir():
        return
    valid_states = {"context-only", "live-promotion", "no-learning", "HITL"}
    for path in sorted(lessons_root.glob("*.md")):
        if path.name == "README.md":
            continue
        text = read(path)
        state_match = re.search(
            r"Promotion state:\s*(context-only|live-promotion|no-learning|HITL)\b",
            text,
            re.IGNORECASE,
        )
        section_match = re.search(
            r"^## Promotion State\s*\n+\s*(context-only|live-promotion|no-learning|HITL)\b",
            text,
            re.MULTILINE,
        )
        state = state_match.group(1) if state_match else section_match.group(1) if section_match else ""
        if state.lower() == "hitl":
            state = "HITL"
        else:
            state = state.lower()

        if not state:
            fail(errors, f"{rel(path)} missing valid promotion state")
            continue

        if state not in valid_states:
            fail(errors, f"{rel(path)} has invalid promotion state: {state}")

        if state == "live-promotion":
            owner_paths = re.findall(
                r"`((?:AGENTS\.md|\.agents/(?:router\.md|resolvers/[^`]+|gates/[^`]+|commands/[^`]+|checks/[^`]+|skills/[^`]+|logs/README\.md)|(?:apps|packages)/[^`]+))`",
                text,
            )
            if not owner_paths:
                fail(errors, f"{rel(path)} live-promotion does not name a live owner surface")
                continue
            existing_owner = False
            for owner_path in owner_paths:
                target = ROOT / owner_path
                if target.exists():
                    existing_owner = True
                    break
            if not existing_owner:
                fail(errors, f"{rel(path)} live-promotion owner surface is missing")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    check_control_plane(errors)
    check_no_retired_runtime_state(errors)
    check_router(errors)
    check_resolvers(errors, warnings)
    check_gates(errors)
    check_commands(errors)
    check_skills(errors)
    check_skill_inventory(errors)
    check_lessons(errors)

    if errors:
        print("agents-kit health: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    if warnings:
        print("agents-kit health: PASS with warnings")
        for warning in warnings:
            print(f"- warning: {warning}")
        return 0

    print("agents-kit health: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
