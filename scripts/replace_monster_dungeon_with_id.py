import json

MONSTERS_PATH = '../raw_data/monsters_raw_no_src.json'
DUNGEONS_PATH = '../raw_data/dungeon_areas_db_export.json'
OUTPUT_PATH = '../raw_data/monsters_raw_dungeonid.json'

def main():
    with open(MONSTERS_PATH, encoding='utf-8') as f:
        monsters = json.load(f)
    with open(DUNGEONS_PATH, encoding='utf-8') as f:
        dungeons = json.load(f)
    # 던전명 → id 매핑
    dungeon_name_to_id = {d['name']: d['id'] for d in dungeons}
    not_found = set()
    for m in monsters:
        dungeon_name = m.get('dungeon')
        if dungeon_name:
            dungeon_id = dungeon_name_to_id.get(dungeon_name)
            if dungeon_id:
                m['dungeon'] = dungeon_id
            else:
                not_found.add(dungeon_name)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(monsters, f, ensure_ascii=False, indent=2)
    if not_found:
        print('매칭 실패 던전명:', not_found)
    else:
        print('모든 던전명 매칭 성공')

if __name__ == '__main__':
    main()
