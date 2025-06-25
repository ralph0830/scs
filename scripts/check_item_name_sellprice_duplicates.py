import json
from collections import defaultdict

with open('raw_data/all_items_data_with_ID.json', encoding='utf-8') as f:
    items = json.load(f)

seen = defaultdict(list)
duplicates = []

for item in items:
    key = (item['name'], item['sell_price'])
    seen[key].append(item['id'])

for key, ids in seen.items():
    if len(ids) > 1:
        duplicates.append({'name': key[0], 'sell_price': key[1], 'ids': ids})

if duplicates:
    print('중복된 name + sell_price 조합 발견:')
    for dup in duplicates:
        print(f"이름: {dup['name']}, 판매가: {dup['sell_price']}, ID 목록: {dup['ids']}")
else:
    print('중복된 name + sell_price 조합이 없습니다.')
