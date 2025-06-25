import json
import sqlite3

# 1. item_types seed 데이터 추출
with open('raw_data/items_raw.json', encoding='utf-8') as f:
    items = json.load(f)

# type.value/text 매핑 추출
item_type_map = {}
for item in items:
    t = item.get('type', {})
    v, txt = t.get('value'), t.get('text')
    if v and txt:
        item_type_map[v] = txt

# type.value별 영문명/카테고리 매핑(수동/샘플)
type_eng_map = {
    '10': ('Material', 'material'),
    '11': ('Processed', 'material'),
    '12': ('Special', 'material'),
    '20': ('Food', 'consumable'),
    '21': ('Shop Food', 'consumable'),
    '31': ('Sword', 'weapon'),
    '32': ('Dagger', 'weapon'),
    '33': ('Staff', 'weapon'),
    '34': ('Bow', 'weapon'),
    '35': ('Heavy Armor', 'armor'),
    '36': ('Medium Armor', 'armor'),
    '37': ('Light Armor', 'armor'),
    '38': ('Accessory', 'accessory'),
    '40': ('Egg', 'egg'),
    '60': ('Potion', 'consumable'),
    '13': ('Special', 'material'),
    '14': ('Special', 'material'),
}

item_types = []
for v, txt in item_type_map.items():
    eng, cat = type_eng_map.get(v, (txt, 'etc'))
    item_types.append((v, txt, eng, cat))

# 2. items 데이터 변환
def safe_int(val):
    try:
        return int(val)
    except:
        return 0

item_rows = []
for item in items:
    item_rows.append((
        item['id'],
        item['name'],
        item.get('description', ''),
        item.get('img', ''),
        item['type']['value'],
        safe_int(item.get('sell_price', 0)),
        item.get('gem_price', ''),
        item.get('feed_power', ''),
        item.get('important_val', ''),
        item.get('stats', ''),
        item.get('stats_eng', ''),
        item.get('equipmentType', None)
    ))

conn = sqlite3.connect('sqlite.db')
c = conn.cursor()

# 3. 테이블 초기화 및 스키마 확장
c.execute('DELETE FROM item_types')
c.execute('DELETE FROM items')
try:
    c.execute('ALTER TABLE items ADD COLUMN gemPrice TEXT')
except:
    pass
try:
    c.execute('ALTER TABLE items ADD COLUMN feedPower TEXT')
except:
    pass
try:
    c.execute('ALTER TABLE items ADD COLUMN importantVal TEXT')
except:
    pass
try:
    c.execute('ALTER TABLE items ADD COLUMN stats TEXT')
except:
    pass
try:
    c.execute('ALTER TABLE items ADD COLUMN statsEng TEXT')
except:
    pass
try:
    c.execute('ALTER TABLE items ADD COLUMN equipmentType TEXT')
except:
    pass

# 4. item_types seed
c.executemany('INSERT INTO item_types (value, text, text_eng, category) VALUES (?, ?, ?, ?)', item_types)

# 5. items seed
c.executemany('''
    INSERT INTO items (
        id, name, description, image_url, type, sell_price, gemPrice, feedPower, importantVal, stats, statsEng, equipmentType
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', item_rows)

conn.commit()
conn.close()

print('item_types, items 마이그레이션/시드 완료')
