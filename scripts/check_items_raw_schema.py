import json
from collections import Counter, defaultdict

with open('raw_data/items_raw.json', encoding='utf-8') as f:
    items = json.load(f)

# 1. type.text 종류/분포
all_types = [item.get('type', {}).get('text', '') for item in items]
type_counter = Counter(all_types)

# 2. 가격 필드 비정상 값
invalid_sell_price = []
for item in items:
    sp = item.get('sell_price', '')
    try:
        int(sp)
    except (ValueError, TypeError):
        invalid_sell_price.append({'id': item['id'], 'name': item['name'], 'sell_price': sp})

# 3. id 중복/누락
ids = [item['id'] for item in items]
id_counter = Counter(ids)
duplicated_ids = [i for i, c in id_counter.items() if c > 1]
missing_ids = set(range(1, max(ids)+1)) - set(ids)

# 4. 추가 필드 타입 분포
extra_fields = ['gem_price', 'feed_power', 'important_val', 'stats', 'stats_eng']
field_types = defaultdict(Counter)
for item in items:
    for f in extra_fields:
        v = item.get(f)
        field_types[f][type(v).__name__] += 1

print('--- type.text 분포 ---')
for t, c in type_counter.items():
    print(f'{t}: {c}')

print('\n--- 가격 필드 비정상 값 ---')
if invalid_sell_price:
    for i in invalid_sell_price:
        print(i)
else:
    print('없음')

print('\n--- id 중복/누락 ---')
if duplicated_ids:
    print('중복 id:', duplicated_ids)
else:
    print('중복 id 없음')
if missing_ids:
    print('누락 id:', sorted(missing_ids))
else:
    print('누락 id 없음')

print('\n--- 추가 필드 타입 분포 ---')
for f, c in field_types.items():
    print(f'{f}: {dict(c)}')
