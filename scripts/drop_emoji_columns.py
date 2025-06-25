import sqlite3
import os

DB_PATH = os.path.abspath('sqlite.db')

def drop_column(table, column):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        # 1. 기존 테이블 구조 확인
        cur.execute(f"PRAGMA table_info({table})")
        columns = [row[1] for row in cur.fetchall() if row[1] != column]
        columns_str = ', '.join(columns)
        # 2. 새 테이블 생성 (emoji 컬럼 제외)
        cur.execute(f"CREATE TABLE {table}_new AS SELECT {columns_str} FROM {table}")
        # 3. 기존 테이블 삭제 및 이름 변경
        cur.execute(f"DROP TABLE {table}")
        cur.execute(f"ALTER TABLE {table}_new RENAME TO {table}")
        conn.commit()

# critters, monsters 테이블에서 emoji 컬럼 삭제
try:
    drop_column('critters', 'emoji')
except Exception as e:
    print('critters:', e)
try:
    drop_column('monsters', 'emoji')
except Exception as e:
    print('monsters:', e)
print('emoji 컬럼 삭제 완료!')
