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


def locked_skill_paths(errors: list[str]) -> dict[str, str]:
    lock_path = ROOT / "skills-lock.json"
    try:
        lock = json.loads(lock_path.read_text())
    except FileNotFoundError:
        fail(errors, "missing file: skills-lock.json")
        return {}
    except json.JSONDecodeError as error:
        fail(errors, f"skills-lock.json is invalid JSON: {error}")
        return {}

    skills = lock.get("skills")
    if not isinstance(skills, dict):
        fail(errors, "skills-lock.json missing skills object")
        return {}

    locked: dict[str, str] = {}
    for name, metadata in skills.items():
        if not isinstance(metadata, dict):
            fail(errors, f"skills-lock.json entry is not an object: {name}")
            continue
        local_path = metadata.get("localPath") or f".agents/skills/{name}/SKILL.md"
        locked[name] = local_path
    return locked


def check_skill_inventory(errors: list[str]) -> None:
    skills_root = ROOT / ".agents" / "skills"
    locked = locked_skill_paths(errors)
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

    log_lines = "\n".join(
        read(path)
        for path in sorted((ROOT / ".agents" / "logs").glob("*.md"))
    ).splitlines()

    for name in sorted(skill_dirs):
        if name in locked:
            continue
        if name == "agents-kit":
            continue
        local_only_line = False
        for line in log_lines:
            if re.search(r"\blocal[- ]only\b", line, re.IGNORECASE) and re.search(
                rf"`?{re.escape(name)}`?", line
            ):
                local_only_line = True
                break
        if not local_only_line:
            fail(
                errors,
                f"unlocked skill lacks local-only log evidence: .agents/skills/{name}",
            )


def check_control_plane(errors: list[str]) -> None:
    require_file(errors, "AGENTS.md")
    require_file(errors, ".agents/README.md")
    require_file(errors, ".agents/AGENT-CONTROL-PLANE.md")
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
        "Scripts",
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
                r"`((?:AGENTS\.md|\.agents/(?:router\.md|resolvers/[^`]+|gates/[^`]+|skills/[^`]+|logs/README\.md)|docs/checks/[^`]+|(?:apps|packages)/[^`]+))`",
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
