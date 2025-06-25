import sqlite3
import os
import json

DB_PATH = os.path.abspath('sqlite.db')
RAW_PATH = os.path.abspath('raw_data/critter_raw.json')

with open(RAW_PATH, encoding='utf-8') as f:
    data = json.load(f)

# '파이로'만 추출, emoji 필드는 무시하고 image_url만 사용
pyro = next((c for c in data if c['name'] == '파이로'), None)
if not pyro:
    print('파이로 데이터가 없습니다.')
    exit(1)

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("""
        INSERT OR REPLACE INTO critters (
            id, name, description, image_url, type, base_hp, base_attack, base_defense, hp_growth, attack_growth, defense_growth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        pyro.get('id'), pyro.get('name'), pyro.get('description'), pyro.get('image_url'), pyro.get('type'),
        pyro.get('base_hp'), pyro.get('base_attack'), pyro.get('base_defense'), pyro.get('hp_growth'), pyro.get('attack_growth'), pyro.get('defense_growth')
    ))
    conn.commit()
print('파이로를 DB에 삽입 완료!')
