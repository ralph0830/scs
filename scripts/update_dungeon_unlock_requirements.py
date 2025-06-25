import sqlite3

conn = sqlite3.connect('sqlite.db')
cursor = conn.cursor()

# 모든 던전 id, name 조회 (id 오름차순)
cursor.execute("SELECT id, name FROM dungeon_areas ORDER BY id ASC")
dungeons = cursor.fetchall()

for i in range(1, len(dungeons)):
    prev_id, prev_name = dungeons[i-1]
    curr_id, curr_name = dungeons[i]
    unlock_text = f"{prev_name} 100회 클리어"
    cursor.execute(
        "UPDATE dungeon_areas SET unlockRequirement = ? WHERE id = ?",
        (unlock_text, curr_id)
    )

# 첫 번째 던전은 해금 조건 없음 (빈 값)
if dungeons:
    cursor.execute(
        "UPDATE dungeon_areas SET unlockRequirement = '' WHERE id = ?",
        (dungeons[0][0],)
    )

conn.commit()
conn.close()
print('던전 해금 조건 일괄 적용 완료!')
