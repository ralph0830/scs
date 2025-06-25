import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    # unlockRequirement 컬럼 삭제
    cur.execute("PRAGMA foreign_keys=off;")
    cur.execute("BEGIN TRANSACTION;")
    # 새 테이블 생성 (camelCase 컬럼 제외)
    cur.execute("CREATE TABLE dungeon_areas_new AS SELECT id, name, description, min_level, max_level, difficulty, unlock_requirement, background_image FROM dungeon_areas;")
    cur.execute("DROP TABLE dungeon_areas;")
    cur.execute("ALTER TABLE dungeon_areas_new RENAME TO dungeon_areas;")
    cur.execute("COMMIT;")
    cur.execute("PRAGMA foreign_keys=on;")
print('unlockRequirement(camelCase) 컬럼 삭제 완료!')
