import sqlite3
import bcrypt

DB_PATH = '../sqlite.db'
NEW_PASSWORD = 'admin123'  # 6자 이상
HASHED = bcrypt.hashpw(NEW_PASSWORD.encode(), bcrypt.gensalt()).decode()

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("UPDATE users SET password = ? WHERE id = ?", (HASHED, 'admin'))
conn.commit()
conn.close()
print('admin 계정 비밀번호를 admin123(bcrypt 해시)로 변경 완료')
