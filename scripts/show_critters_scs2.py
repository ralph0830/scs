import sqlite3
import json

DB_PATH = r'd:/project/gamedev/scs2/sqlite.db'

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id, name, description, emoji, image_url, type, base_hp, base_attack, base_defense FROM critters ORDER BY id ASC")
    rows = cur.fetchall()
    print(f"{'ID':<3} | {'이름':<12} | {'타입':<8} | {'HP':<4} | {'ATK':<4} | {'DEF':<4} | {'이모지':<4} | {'이미지':<20} | {'설명'}")
    print('-'*100)
    for row in rows:
        print(' | '.join(str(x) for x in row))
