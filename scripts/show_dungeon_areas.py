import sqlite3
import os
import json

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, name, min_level, max_level, difficulty, unlock_requirement FROM dungeon_areas ORDER BY id ASC")
    rows = cur.fetchall()
    print(f"{'ID':<3} | {'이름':<20} | {'난이도':<6} | {'레벨':<7} | {'해금 조건':<40}")
    print('-'*100)
    for row in rows:
        id_, name, minLevel, maxLevel, difficulty, unlock = row
        if unlock:
            try:
                unlock_obj = json.loads(unlock)
                if isinstance(unlock_obj, dict) and 'requirements' in unlock_obj:
                    conds = [f"D{r['dungeonId']}: {r['clearCount']}회" for r in unlock_obj['requirements']]
                    unlock_str = f"{unlock_obj['type']} - " + ', '.join(conds)
                else:
                    unlock_str = unlock
            except Exception:
                unlock_str = unlock
        else:
            unlock_str = ''
        print(f"{id_:<3} | {name:<20} | {difficulty:<6} | {minLevel}~{maxLevel:<3} | {unlock_str:<40}")
