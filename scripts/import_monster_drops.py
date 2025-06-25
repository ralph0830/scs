import sqlite3
import json

# DB 및 데이터 파일 경로
DB_PATH = '../sqlite.db'
MONSTERS_JSON = '../raw_data/monsters_raw.json'
ITEMS_JSON = '../raw_data/items_db_export.json'

def main():
    # DB 연결
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # 데이터 로드
    with open(MONSTERS_JSON, encoding='utf-8') as f:
        monsters = json.load(f)
    with open(ITEMS_JSON, encoding='utf-8') as f:
        items = json.load(f)

    # 아이템명 → id 매핑
    item_title_to_id = {i['name']: i['id'] for i in items}
    # 몬스터명 → id 매핑
    monster_name_to_id = {row[1]: row[0] for row in c.execute('SELECT id, name FROM monsters')}

    drop_count = 0
    not_found_items = set()
    not_found_monsters = set()

    for m in monsters:
        mname = m['nameKor']
        mid = monster_name_to_id.get(mname)
        if not mid:
            not_found_monsters.add(mname)
            continue
        for drop in m.get('dropItems', []):
            title = drop['title']
            iid = item_title_to_id.get(title)
            if not iid:
                not_found_items.add(title)
                continue
            # drop_rate 정보가 없으므로 None으로 저장
            c.execute('INSERT INTO monster_drops (monster_id, item_id, drop_rate) VALUES (?, ?, ?)', (mid, iid, None))
            drop_count += 1
    conn.commit()
    conn.close()

    print(f'Inserted {drop_count} drops.')
    if not_found_monsters:
        print('몬스터 미존재:', not_found_monsters)
    if not_found_items:
        print('아이템 미존재:', not_found_items)

if __name__ == '__main__':
    main()
