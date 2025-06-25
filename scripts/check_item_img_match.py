import json
import os
import re

ITEMS_PATH = 'raw_data/items_raw_NEW.json'
IMG_DIR = 'public/items'

# 파일명 변환 함수
def name_eng_to_filename(name_eng):
    if not name_eng:
        return None
    # 소문자, 공백/하이픈/슬래시/점/아포스트로피/괄호 등 제거 및 언더스코어 변환
    name = name_eng.lower()
    name = re.sub(r"[\s\-'/\\.()]+", '_', name)
    name = re.sub(r'[^a-z0-9_]', '', name)
    name = re.sub(r'_+', '_', name).strip('_')
    return f"{name}.png"

# 이미지 파일 목록
img_files = set(os.listdir(IMG_DIR))

with open(ITEMS_PATH, encoding='utf-8') as f:
    items = json.load(f)

not_matched = []
matched = 0
for item in items:
    fname = name_eng_to_filename(item.get('name_eng'))
    if fname and fname in img_files:
        matched += 1
    else:
        not_matched.append({'id': item['id'], 'name': item['name'], 'name_eng': item.get('name_eng'), 'expected_img': fname})

print(f"총 {len(items)}개 중 {matched}개 매칭, {len(not_matched)}개 미매칭")
if not_matched:
    print("매칭 실패 리스트:")
    for n in not_matched:
        print(n)
