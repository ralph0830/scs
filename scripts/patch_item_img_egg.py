import json
import os

ITEMS_PATH = 'raw_data/items_raw_NEW.json'
IMG_DIR = 'public/items'
OUTPUT_PATH = 'raw_data/items_raw_NEW.json'

# egg_로 시작하는 파일명 매핑
img_files = [f for f in os.listdir(IMG_DIR) if f.startswith('egg_') and f.endswith('.png')]
img_map = {
    'Wild Egg': 'egg_wild.png',
    'Wooden Egg': 'egg_wooden.png',
    'Insect Egg': 'egg_insect.png',
    'Avian Egg': 'egg_avian.png',
    'Esoteric Egg': 'egg_esoteric.png',
    'Construct Egg': 'egg_construct.png',
    'Reptile Egg': 'egg_reptile.png',
}

with open(ITEMS_PATH, encoding='utf-8') as f:
    items = json.load(f)

for item in items:
    name_eng = item.get('name_eng')
    if name_eng in img_map:
        item['img'] = img_map[name_eng]

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print('egg_ 이미지 매핑 완료')
