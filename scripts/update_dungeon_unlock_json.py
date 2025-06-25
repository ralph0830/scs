import sqlite3
import os
import json

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

with sqlite3.connect(DB_PATH) as conn:
    cur = conn.cursor()
    cur.execute("SELECT id FROM dungeon_areas ORDER BY id ASC")
    dungeons = cur.fetchall()
    for i in range(1, len(dungeons)):
        prev_id = dungeons[i-1][0]
        curr_id = dungeons[i][0]
        unlock_json = json.dumps({
            "type": "AND",
            "requirements": [
                {"dungeonId": prev_id, "clearCount": 100}
            ]
        }, ensure_ascii=False)
        cur.execute(
            "UPDATE dungeon_areas SET unlock_requirement = ? WHERE id = ?",
            (unlock_json, curr_id)
        )
    # 첫 번째 던전은 해금 조건 없음
    if dungeons:
        cur.execute(
            "UPDATE dungeon_areas SET unlock_requirement = '' WHERE id = ?",
            (dungeons[0][0],)
        )
    conn.commit()
print('던전 해금 조건(JSON) 일괄 적용 완료!')
