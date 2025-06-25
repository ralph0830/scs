import json
import os
import re

ITEMS_PATH = 'raw_data/items_raw_NEW.json'
IMG_DIR = 'public/items'
OUTPUT_PATH = 'raw_data/items_raw_NEW.json'

# 파일명 변환 함수
def name_eng_to_filename(name_eng):
    if not name_eng:
        return None
    name = name_eng.lower()
    name = re.sub(r"[\s\-'/\\.()]+", '_', name)
    name = re.sub(r'[^a-z0-9_]', '', name)
    name = re.sub(r'_+', '_', name).strip('_')
    return f"{name}.png"

img_files = set(os.listdir(IMG_DIR))

with open(ITEMS_PATH, encoding='utf-8') as f:
    items = json.load(f)

for item in items:
    fname = name_eng_to_filename(item.get('name_eng'))
    if fname and fname in img_files:
        item['img'] = fname
    else:
        item['img'] = 'no-image.png'

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"이미지 경로 패치 완료: {len(items)}개 아이템")
