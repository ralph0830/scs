import json

MONSTERS_PATH = '../raw_data/monsters_raw.json'
DUNGEONS_PATH = '../raw_data/dungeon_areas_db_export.json'
OUTPUT_PATH = '../raw_data/monsters_raw_dungeonid.json'

def main():
    with open(MONSTERS_PATH, encoding='utf-8') as f:
        monsters = json.load(f)
    with open(DUNGEONS_PATH, encoding='utf-8') as f:
        dungeons = json.load(f)
    # 던전명 → id 매핑
    dungeon_name_to_id = {d['name']: d['id'] for d in dungeons}
    for m in monsters:
        dungeon_name = m.get('dungeon')
        if dungeon_name and dungeon_name in dungeon_name_to_id:
            m['dungeon'] = dungeon_name_to_id[dungeon_name]
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(monsters, f, ensure_ascii=False, indent=2)
    print(f'변환 완료: {OUTPUT_PATH}')

if __name__ == '__main__':
    main()
