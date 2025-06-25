import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, name, unlockRequirement FROM dungeon_areas ORDER BY id ASC")
    rows = cur.fetchall()
    for row in rows:
        print(row)
