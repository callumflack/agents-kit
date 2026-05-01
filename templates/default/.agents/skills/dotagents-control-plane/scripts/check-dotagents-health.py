#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
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


def check_resolvers(errors: list[str]) -> None:
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


def check_control_plane(errors: list[str]) -> None:
    require_file(errors, "AGENTS.md")
    require_file(errors, ".agents/README.md")
    require_file(errors, ".agents/AGENT-CONTROL-PLANE.md")
    require_file(errors, ".agents/active-work.md")
    require_file(errors, "history/solutions/README.md")

    agents_text = read(ROOT / "AGENTS.md")
    if len(agents_text.splitlines()) > 90:
        fail(errors, "AGENTS.md is too large for a boot file")

    doctrine = read(ROOT / ".agents/AGENT-CONTROL-PLANE.md")
    for phrase in [
        "Solutions",
        "Artifacts",
        "Health",
        "Placement Test",
        "Skills",
    ]:
        if f"## {phrase}" not in doctrine:
            fail(errors, f".agents/AGENT-CONTROL-PLANE.md missing ## {phrase}")


def main() -> int:
    errors: list[str] = []
    check_control_plane(errors)
    check_router(errors)
    check_resolvers(errors)
    check_gates(errors)
    check_skills(errors)

    if errors:
        print("dotagents health: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("dotagents health: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
