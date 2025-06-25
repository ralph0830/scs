import json

# 파일 경로
items_raw_path = 'raw_data/items_raw.json'
all_items_path = 'raw_data/all_items_data_with_ID.json'
output_path = 'raw_data/items_raw_NEW.json'

# 데이터 로드
def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def save_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

items_raw = load_json(items_raw_path)
all_items = load_json(all_items_path)

# nameKor -> items_raw 매핑
raw_map = {item['nameKor']: item for item in items_raw}

merged = []
for item in all_items:
    nameKor = item['name']
    base = dict(item)  # all_items의 정보를 우선 신뢰
    # img 필드 보정
    img = raw_map.get(nameKor, {}).get('img')
    if not img:
        img = 'no-image.png'
    base['img'] = img
    merged.append(base)

save_json(merged, output_path)
print(f"병합 완료: {len(merged)}개 아이템 → {output_path}")
