import json
import sqlite3

# 난이도 분할 기준
DIFFICULTY_STEPS = [
    ("very easy", 1, 2),
    ("easy", 3, 4),
    ("normal", 5, 8),
    ("hard", 9, 12),
    ("very hard", 13, 16),
    ("hell", 17, 19),
    ("no record", 20, 99),
]

def get_difficulty(id):
    for diff, start, end in DIFFICULTY_STEPS:
        if start <= id <= end:
            return diff
    return "no record"

with open('raw_data/dungeons_raw.json', encoding='utf-8') as f:
    dungeons = json.load(f)

rows = []
for d in dungeons:
    id_ = int(d['value'])
    name = d['name']
    difficulty = get_difficulty(id_)
    rows.append((id_, name, '', 1, 100, difficulty, '', ''))

conn = sqlite3.connect('sqlite.db')
c = conn.cursor()
c.execute('DELETE FROM dungeon_areas')
conn.commit()
c.executemany('INSERT INTO dungeon_areas (id, name, description, min_level, max_level, difficulty, unlock_requirement, background_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', rows)
conn.commit()
conn.close()
print(f"던전 {len(rows)}개 덮어쓰기 완료")
