import json

with open('raw_data/items_raw_NEW.json', encoding='utf-8') as f:
    items = json.load(f)

no_img = [
    {
        'id': item['id'],
        'name': item['name'],
        'name_eng': item.get('name_eng'),
        'type': item['type']['text']
    }
    for item in items if item.get('img') == 'no-image.png'
]

if no_img:
    print(f'no-image.png 아이템 {len(no_img)}개:')
    for i in no_img:
        print(f"ID: {i['id']}, 이름: {i['name']}, 영문명: {i['name_eng']}, 타입: {i['type']}")
else:
    print('no-image.png 아이템 없음')
