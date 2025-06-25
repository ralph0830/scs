import sqlite3

DB_PATH = "sqlite.db"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# /images/ → /monsters/ 로 변환
cur.execute("""
    UPDATE monsters
    SET image_url = REPLACE(image_url, '/images/', '/monsters/')
    WHERE image_url LIKE '/images/%'
""")

conn.commit()
print("image_url 경로 일괄 변환 완료 (/images/ → /monsters/)")
conn.close()
