import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, area_id, monster_id, spawn_rate, min_level, max_level, is_boss FROM monster_spawns WHERE area_id = 1 ORDER BY id ASC")
    rows = cur.fetchall()
    print(f"{'ID':<3} | {'area_id':<7} | {'monster_id':<10} | {'spawn_rate':<10} | {'min_level':<9} | {'max_level':<9} | {'is_boss':<7}")
    print('-'*70)
    for row in rows:
        print(' | '.join(str(x) for x in row))
