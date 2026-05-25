#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def fail(errors: list[str], path: Path, message: str) -> None:
    errors.append(f"{rel(path)}: {message}")


def has_indented_block(lines: list[str], start_index: int) -> bool:
    for line in lines[start_index + 1 :]:
        if not line.strip():
            continue
        if line.startswith((" ", "\t")):
            return True
        return False
    return False


def check_skill(path: Path) -> list[str]:
    errors: list[str] = []
    if not path.is_file():
        fail(errors, path, "missing file")
        return errors

    lines = path.read_text().splitlines()
    if not lines or lines[0] != "---":
        fail(errors, path, "missing YAML frontmatter")
        return errors

    try:
        end = lines[1:].index("---") + 1
    except ValueError:
        fail(errors, path, "frontmatter is not closed")
        return errors

    frontmatter = lines[1:end]
    name_lines = [
        line
        for line in frontmatter
        if line.startswith("name:")
    ]
    description_lines = [
        (index, line)
        for index, line in enumerate(frontmatter)
        if line.startswith("description:")
    ]

    if len(name_lines) != 1:
        fail(errors, path, "frontmatter must contain exactly one name")
    elif path.name == "SKILL.md" and path.parent.parent.name == "skills":
        expected_name = path.parent.name
        actual_name = name_lines[0].split(":", 1)[1].strip().strip("\"'")
        if actual_name != expected_name:
            fail(errors, path, f"frontmatter name should be {expected_name}")

    if len(description_lines) != 1:
        fail(errors, path, "frontmatter must contain exactly one description")
        return errors

    index, description_line = description_lines[0]
    value = description_line.split(":", 1)[1].strip()
    if value in {"|", "|-", "|+", ">", ">-", ">+"}:
        if not has_indented_block(frontmatter, index):
            fail(errors, path, "block description has no indented body")
        return errors

    if not value:
        fail(errors, path, "description must be quoted or use block style")
        return errors

    quote = value[0]
    if quote not in {"\"", "'"} or len(value) < 2 or value[-1] != quote:
        fail(errors, path, "single-line description must be quoted")

    return errors


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: check-skill-frontmatter.py <path-to-SKILL.md> [...]", file=sys.stderr)
        return 2

    errors: list[str] = []
    for raw_path in argv:
        path = Path(raw_path)
        if not path.is_absolute():
            path = ROOT / path
        errors.extend(check_skill(path))

    if errors:
        print("skill frontmatter: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("skill frontmatter: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
