import json

# type.text 기준 분류
WEAPON_TEXTS = {"검", "단검", "지팡이", "활"}
ARMOR_TEXTS = {"헤비아머", "미디엄아머", "라이트아머"}
ACCESSORY_TEXTS = {"액세서리"}

def get_equipment_type(type_text):
    if type_text in WEAPON_TEXTS:
        return "weapon"
    if type_text in ARMOR_TEXTS:
        return "armor"
    if type_text in ACCESSORY_TEXTS:
        return "accessory"
    return None

with open('raw_data/items_raw.json', encoding='utf-8') as f:
    items = json.load(f)

for item in items:
    type_text = item.get('type', {}).get('text')
    eq_type = get_equipment_type(type_text)
    if eq_type:
        item['equipmentType'] = eq_type

with open('raw_data/items_raw.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print('equipmentType 필드 추가 및 반영 완료')
