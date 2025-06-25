import sqlite3
import os

# 로그 파일을 scripts/ 내부에 남기도록 경로 수정
LOG_PATH = os.path.join(os.path.dirname(__file__), 'dungeon_unlock_result.log')
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../sqlite.db'))

def log(msg):
    with open(LOG_PATH, 'a', encoding='utf-8') as f:
        f.write(str(msg) + '\n')

log(f"DB 경로: {DB_PATH}")

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # unlockRequirement 컬럼 존재 여부 확인 및 없으면 추가
    cursor.execute("PRAGMA table_info(dungeon_areas)")
    columns = [row[1] for row in cursor.fetchall()]
    if 'unlockRequirement' not in columns:
        cursor.execute("ALTER TABLE dungeon_areas ADD COLUMN unlockRequirement TEXT")
        log("unlockRequirement 컬럼을 추가했습니다.")
    else:
        log("unlockRequirement 컬럼이 이미 존재합니다.")

    cursor.execute("SELECT id, name FROM dungeon_areas ORDER BY id ASC")
    dungeons = cursor.fetchall()
    log(f"던전 개수: {len(dungeons)}")

    for i in range(1, len(dungeons)):
        prev_id, prev_name = dungeons[i-1]
        curr_id, curr_name = dungeons[i]
        unlock_text = f"{prev_name} 100회 클리어"
        cursor.execute(
            "UPDATE dungeon_areas SET unlockRequirement = ? WHERE id = ?",
            (unlock_text, curr_id)
        )
        log(f"{curr_name} → {unlock_text}")

    if dungeons:
        cursor.execute(
            "UPDATE dungeon_areas SET unlockRequirement = '' WHERE id = ?",
            (dungeons[0][0],)
        )
        log(f"{dungeons[0][1]} → 해금 조건 없음")

    conn.commit()
    log('던전 해금 조건 일괄 적용 완료!')
except Exception as e:
    log(f"오류 발생: {e}")
finally:
    if 'conn' in locals():
        conn.close()
