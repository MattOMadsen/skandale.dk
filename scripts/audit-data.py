#!/usr/bin/env python3
"""Validerer at alle politiker-datafiler er komplette og konsistente."""

import json
import sys
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def audit():
    issues = []
    manifest_path = BASE / "data/politicians/manifest.json"
    manifest = load_json(manifest_path)
    slugs = manifest.get("politicians", [])

    if not slugs:
        issues.append("Manifest har ingen politikere")
        return issues

    ids = []

    for slug in slugs:
        pol_file = BASE / f"data/politicians/{slug}.json"
        if not pol_file.exists():
            issues.append(f"MISSING politician: {slug}")
            continue

        pol = load_json(pol_file)
        for field in ("id", "name", "party", "bio", "initials"):
            if not pol.get(field):
                issues.append(f"MISSING field '{field}' in {slug}")

        ids.append(pol.get("id"))

        sc_dir = BASE / f"data/scandals/{slug}"
        sc_file = BASE / f"data/scandals/{slug}.json"
        if (sc_dir / "manifest.json").exists():
            m = load_json(sc_dir / "manifest.json")
            for f in m.get("scandals", []):
                if not (sc_dir / f).exists():
                    issues.append(f"MISSING scandal file: {slug}/{f}")
        elif not sc_file.exists():
            issues.append(f"MISSING scandals for {slug}")

        if not (BASE / f"data/affiliations/{slug}.json").exists():
            issues.append(f"MISSING affiliations for {slug}")

        if not (BASE / f"data/economic-support/{slug}.json").exists():
            issues.append(f"MISSING economic-support for {slug}")

        bp_dir = BASE / f"data/broken-promises/{slug}"
        bp_file = BASE / f"data/broken-promises/{slug}.json"
        if (bp_dir / "manifest.json").exists():
            m = load_json(bp_dir / "manifest.json")
            for f in m.get("brokenPromises", []):
                if not (bp_dir / f).exists():
                    issues.append(f"MISSING broken-promise file: {slug}/{f}")
        elif not bp_file.exists():
            issues.append(f"MISSING broken-promises for {slug}")

    for id_val, count in Counter(ids).items():
        if count > 1:
            issues.append(f"DUPLICATE id {id_val} ({count} gange)")

    pol_files = [
        f for f in (BASE / "data/politicians").glob("*.json")
        if f.name != "manifest.json"
    ]
    for f in pol_files:
        if f.stem not in slugs:
            issues.append(f"ORPHAN politician file: {f.name}")

    if len(pol_files) != len(slugs):
        issues.append(f"COUNT mismatch: manifest={len(slugs)} files={len(pol_files)}")

    return issues


def main():
    issues = audit()
    print(f"Audit: {len(issues)} issue(s)")
    for issue in issues:
        print(f"  - {issue}")

    if issues:
        sys.exit(1)

    print("OK – alle datafiler er konsistente")
    sys.exit(0)


if __name__ == "__main__":
    main()