import sqlite3
import os
import json

DB_PATH = os.path.abspath('sqlite.db')
RAW_PATH = os.path.abspath('raw_data/critter_raw.json')

with open(RAW_PATH, encoding='utf-8') as f:
    data = json.load(f)

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    for c in data:
        cur.execute("""
            INSERT OR REPLACE INTO critters (
                id, name, description, emoji, image_url, type, base_hp, base_attack, base_defense, hp_growth, attack_growth, defense_growth
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c.get('id'), c.get('name'), c.get('description'), c.get('emoji'), c.get('image_url'), c.get('type'),
            c.get('base_hp'), c.get('base_attack'), c.get('base_defense'), c.get('hp_growth'), c.get('attack_growth'), c.get('defense_growth')
        ))
    conn.commit()
print(f"Imported {len(data)} critters into DB.")
