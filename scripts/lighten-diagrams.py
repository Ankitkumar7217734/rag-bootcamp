#!/usr/bin/env python3
"""Apply white-background light theme to all inline SVG diagrams in chapters/."""

import glob
import re
from pathlib import Path

CHAPTERS_DIR = Path(__file__).resolve().parent.parent / "chapters"
WHITE_RECT = '  <rect width="100%" height="100%" fill="#ffffff"/>\n'

REPLACEMENTS = [
    ('fill="#1a1a2e"', 'fill="#ffffff"'),
    ('fill="#16161a"', 'fill="#ffffff"'),
    ('fill="#0e0e10"', 'fill="#f8fafc"'),
    ('fill="#4f4f57"', 'fill="#ffffff"'),
    ('fill="#b4b4be"', 'fill="#374151"'),
    ('fill="#76767f"', 'fill="#64748b"'),
    ('fill="#ececf1"', 'fill="#1e293b"'),
    ('fill="#818cf8"', 'fill="#4338ca"'),
    ('fill="#9aa0ff"', 'fill="#4338ca"'),
    ('fill="#6366f1"', 'fill="#4338ca"'),
    ('fill="#4ecca3"', 'fill="#047857"'),
    ('fill="#a78bfa"', 'fill="#6d28d9"'),
    ('fill="#fbbf24"', 'fill="#b45309"'),
    ('fill="#ffd166"', 'fill="#b45309"'),
    ('fill="#ef6461"', 'fill="#dc2626"'),
    ('stroke="#818cf8"', 'stroke="#4f46e5"'),
    ('stroke="#6366f1"', 'stroke="#4f46e5"'),
    ('stroke="#4ecca3"', 'stroke="#059669"'),
    ('stroke="#a78bfa"', 'stroke="#7c3aed"'),
    ('stroke="#fbbf24"', 'stroke="#d97706"'),
    ('stroke="#ffd166"', 'stroke="#d97706"'),
    ('stroke="#ef6461"', 'stroke="#dc2626"'),
    ('stroke="#26262c"', 'stroke="#d1d5db"'),
    ('stroke="#36363e"', 'stroke="#cbd5e1"'),
    ('stroke="#3a3550"', 'stroke="#cbd5e1"'),
    ('stroke="#76767f"', 'stroke="#94a3b8"'),
    ('stroke="#b4b4be"', 'stroke="#94a3b8"'),
    ('fill="#f3f4f6"', 'fill="#ffffff"'),
]

SVG_PATTERN = re.compile(
    r'<svg class="diagram-svg[^"]*"[^>]*>.*?</svg>',
    re.DOTALL,
)


def add_white_background(svg: str) -> str:
    if 'width="100%" height="100%" fill="#ffffff"' in svg:
        return svg
    if '</defs>' in svg:
        return svg.replace('</defs>', '</defs>\n' + WHITE_RECT, 1)
    match = re.search(r'<svg[^>]*>', svg, re.DOTALL)
    if not match:
        return svg
    pos = match.end()
    return svg[:pos] + '\n' + WHITE_RECT + svg[pos:]


def process_file(path: Path) -> bool:
    content = path.read_text(encoding='utf-8')
    original = content

    for old, new in REPLACEMENTS:
        content = content.replace(old, new)

    content = SVG_PATTERN.sub(lambda m: add_white_background(m.group(0)), content)

    if content != original:
        path.write_text(content, encoding='utf-8')
        return True
    return False


def main() -> None:
    changed = 0
    for path in sorted(CHAPTERS_DIR.glob('*.html')):
        if process_file(path):
            changed += 1
            print(f'updated {path.name}')
    print(f'done — {changed} file(s) updated')


if __name__ == '__main__':
    main()
