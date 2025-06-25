import sqlite3
import json

DB_PATH = '../sqlite.db'
MONSTERS_JSON = '../raw_data/monsters_raw.json'
ITEMS_JSON = '../raw_data/items_db_export.json'

def main():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    with open(MONSTERS_JSON, encoding='utf-8') as f:
        monsters = json.load(f)
    with open(ITEMS_JSON, encoding='utf-8') as f:
        items = json.load(f)

    item_title_to_id = {i['name']: i['id'] for i in items}

    inserted_monsters = 0
    inserted_drops = 0
    not_found_items = set()

    for m in monsters:
        # 몬스터 테이블에 삽입
        name = m.get('nameKor')
        description = ''
        image_url = m.get('img')
        mtype = m.get('atkType')
        base_hp = int(m.get('hp', 0))
        base_attack = None
        base_defense = int(m.get('df', 0))
        rarity = None
        experience_reward = int(m.get('exp', 0))
        gold_reward = None
        dungeon_id = m.get('dungeon')
        # 이미 존재하는지 확인(이름+던전id 기준)
        c.execute('SELECT id FROM monsters WHERE name=? AND image_url=?', (name, image_url))
        row = c.fetchone()
        if row:
            monster_id = row[0]
        else:
            c.execute('INSERT INTO monsters (name, description, image_url, type, base_hp, base_attack, base_defense, rarity, experience_reward, gold_reward) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                (name, description, image_url, mtype, base_hp, base_attack, base_defense, rarity, experience_reward, gold_reward))
            monster_id = c.lastrowid
            inserted_monsters += 1
        # 드랍 정보 삽입
        for drop in m.get('dropItems', []):
            title = drop['title']
            iid = item_title_to_id.get(title)
            if not iid:
                not_found_items.add(title)
                continue
            drop_rate = None  # 확률 정보가 있으면 여기에 할당
            c.execute('INSERT INTO monster_drops (monster_id, item_id, drop_rate) VALUES (?, ?, ?)', (monster_id, iid, drop_rate))
            inserted_drops += 1
    conn.commit()
    conn.close()
    print(f'몬스터 {inserted_monsters}개, 드랍 {inserted_drops}개 삽입 완료')
    if not_found_items:
        print('아이템 미존재:', not_found_items)

if __name__ == '__main__':
    main()
