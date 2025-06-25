import sqlite3
import json
import os

DB_PATH = "sqlite.db"
EXPORT_DIR = "raw_data"

# 내보낼 테이블 목록 (원하면 자동 조회도 가능)
tables = [
    "monsters",
    "monster_spawns",
    "monster_skills",
    "monster_skill_assignments",
    "critters",
    "skills",
    "critter_skills",
    "users",
    "user_critters",
    "dungeon_parties",
    "dungeon_party_slots",
    "type_matchups"
]

os.makedirs(EXPORT_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

for table in tables:
    cur.execute(f"SELECT * FROM {table}")
    rows = cur.fetchall()
    col_names = [desc[0] for desc in cur.description]
    data = [dict(zip(col_names, row)) for row in rows]
    out_path = os.path.join(EXPORT_DIR, f"{table}_db_export.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"{table} → {out_path} 저장 완료 ({len(data)} rows)")

conn.close()
print("모든 테이블 내보내기 완료!")
