import json

INPUT = '../raw_data/monsters_raw.json'
OUTPUT = '../raw_data/monsters_raw_no_src.json'

def main():
    with open(INPUT, encoding='utf-8') as f:
        monsters = json.load(f)
    for m in monsters:
        if 'dropItems' in m:
            for drop in m['dropItems']:
                drop.pop('src', None)
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(monsters, f, ensure_ascii=False, indent=2)
    print(f'변환 완료: {OUTPUT}')

if __name__ == '__main__':
    main()
