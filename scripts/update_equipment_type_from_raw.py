import json
import sqlite3

data = json.load(open('raw_data/items_raw.json', encoding='utf-8'))
conn = sqlite3.connect('sqlite.db')
c = conn.cursor()
update_count = 0
for item in data:
    eq_type = item.get('equipmentType')
    if not eq_type:
        continue
    item_id = item.get('id')
    name = item.get('name')
    if item_id:
        c.execute('UPDATE items SET equipment_type=? WHERE id=?', (eq_type, item_id))
        if c.rowcount:
            update_count += 1
    elif name:
        c.execute('UPDATE items SET equipment_type=? WHERE name=?', (eq_type, name))
        if c.rowcount:
            update_count += 1
conn.commit()
conn.close()
print(f'Updated equipment_type for {update_count} items.')
