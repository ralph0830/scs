import sqlite3
import os
import json

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))
OUT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../raw_data/critter_raw.json'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, name, description, emoji, image_url, type, base_hp, base_attack, base_defense, hp_growth, attack_growth, defense_growth FROM critters ORDER BY id ASC")
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    data = [dict(zip(columns, row)) for row in rows]

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Exported {len(data)} critters to {OUT_PATH}")
