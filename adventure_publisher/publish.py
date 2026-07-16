from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLISHER = Path(__file__).resolve().parent
TEMPLATE_PATH = PUBLISHER / "templates" / "skill.html"
DATA_DIR = PUBLISHER / "data" / "skills"


def render_skill(data: dict[str, object], template: str) -> str:
    steps = data.get("steps", [])
    cards = []
    for step in steps:
        cards.append(
            '<article class="skill-card">'
            f'<div class="skill-icon" aria-hidden="true">{html.escape(str(step["icon"]))}</div>'
            f'<h3>{html.escape(str(step["title"]))}</h3>'
            f'<p>{html.escape(str(step["text"]))}</p>'
            '</article>'
        )

    challenge_items = "".join(
        f'<li><label><input type="checkbox"> {html.escape(str(item))}</label></li>'
        for item in data.get("challenge", [])
    )

    replacements = {
        "{{TITLE}}": html.escape(str(data["title"])),
        "{{EYEBROW}}": html.escape(str(data.get("eyebrow", "Quick Guide"))),
        "{{INTRO}}": html.escape(str(data["intro"])),
        "{{SITUATION}}": html.escape(str(data["situation"])),
        "{{STEP_CARDS}}": "".join(cards),
        "{{CHALLENGE_ITEMS}}": challenge_items,
        "{{TIP}}": html.escape(str(data["tip"])),
        "{{TYLER_QUOTE}}": html.escape(str(data["tyler_quote"])),
        "{{LESSON}}": html.escape(str(data["lesson"])),
        "{{CONTINUE_URL}}": html.escape(str(data["continue_url"]), quote=True),
        "{{LIBRARY_URL}}": html.escape(str(data["library_url"]), quote=True),
    }

    output = template
    for marker, value in replacements.items():
        output = output.replace(marker, value)
    return output


def main() -> None:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    for data_path in sorted(DATA_DIR.glob("*.json")):
        data = json.loads(data_path.read_text(encoding="utf-8"))
        slug = str(data["slug"])
        output_path = ROOT / f"mission-02-{slug}" / f"mission-02-{slug}.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(render_skill(data, template), encoding="utf-8")
        print(f"Published {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
