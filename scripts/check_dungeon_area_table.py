import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, name, unlockRequirement FROM dungeon_areas ORDER BY id ASC")
    rows = cur.fetchall()

# 표 형태로 출력
header = f"{'ID':<3} | {'던전명':<20} | {'해금 조건':<30}"
print(header)
print('-' * len(header))
for row in rows:
    id_, name, unlock = row
    print(f"{id_:<3} | {name:<20} | {unlock:<30}")
