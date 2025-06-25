import json
import sqlite3

# 파일 경로
JSON_PATH = "raw_data/monsters_raw_dungeonid.json"
DB_PATH = "sqlite.db"

# JSON 로드
def load_monsters():
    with open(JSON_PATH, encoding="utf-8") as f:
        data = f.read()
        # JSON 배열이 아니라면, 앞뒤 대괄호 추가
        if not data.strip().startswith("["):
            data = f"[{data}\n]"
        return json.loads(data)

def main():
    monsters = load_monsters()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    for m in monsters:
        nameKor = m.get("nameKor")
        dungeon_id = m.get("dungeon")
        if not nameKor or not dungeon_id:
            print(f"누락 데이터: {m}")
            continue

        # monsters 테이블에서 name(또는 nameKor)로 id 조회
        cur.execute("SELECT id FROM monsters WHERE name = ?", (nameKor,))
        row = cur.fetchone()
        if not row:
            print(f"몬스터 '{nameKor}' DB에 없음, 건너뜀")
            continue
        monster_id = row[0]

        # monster_spawns에 이미 등록되어 있는지 확인
        cur.execute("SELECT 1 FROM monster_spawns WHERE area_id = ? AND monster_id = ?", (dungeon_id, monster_id))
        if cur.fetchone():
            print(f"던전 {dungeon_id} - 몬스터 {nameKor} 이미 등록됨")
            continue

        # monster_spawns에 등록
        cur.execute(
            "INSERT INTO monster_spawns (area_id, monster_id) VALUES (?, ?)",
            (dungeon_id, monster_id)
        )
        print(f"던전 {dungeon_id} - 몬스터 {nameKor} 등록 완료")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
