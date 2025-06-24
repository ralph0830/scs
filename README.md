# 별빛 크리터 이야기 (Starlight Critter Story)

웹 기반 RPG 게임 프로젝트

## 🚀 서버 실행 방법

### 개발 환경
```bash
npm run dev
```

### 프로덕션 환경 (PM2 사용)

#### 1. 서버 시작
```bash
# 쉘 스크립트 사용 (권장)
./scripts/start-server.sh

# 또는 npm 스크립트 사용
npm run pm2:start
```

#### 2. 서버 중지
```bash
# 쉘 스크립트 사용
./scripts/stop-server.sh

# 또는 npm 스크립트 사용
npm run pm2:stop
```

#### 3. 서버 재시작
```bash
# 쉘 스크립트 사용
./scripts/restart-server.sh

# 또는 npm 스크립트 사용
npm run pm2:restart
```

#### 4. 서버 상태 확인
```bash
# 상태 확인
npm run pm2:status

# 로그 확인
npm run pm2:logs

# 실시간 모니터링
npm run pm2:monit
```

### PM2 명령어 요약
| 명령어 | 설명 |
|--------|------|
| `npm run pm2:start` | 서버 시작 |
| `npm run pm2:stop` | 서버 중지 |
| `npm run pm2:restart` | 서버 재시작 |
| `npm run pm2:delete` | PM2 프로세스 삭제 |
| `npm run pm2:logs` | 로그 확인 |
| `npm run pm2:status` | 상태 확인 |
| `npm run pm2:monit` | 실시간 모니터링 |

## 📋 주요 기능

- 몬스터 크롤링 및 한글화 (157개)
- 아이템 시스템 (4,403개)
- JWT 기반 인증 시스템
- 던전 시스템
- 부화장 시스템
- 관리자 페이지
- 모바일 최적화 UI

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.3.4, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite, Drizzle ORM
- **Authentication**: JWT
- **UI**: Tailwind CSS, ShadCN
- **Process Manager**: PM2
- **Testing**: Playwright

## 🌐 접속 정보

- **개발 서버**: http://localhost:3000
- **프로덕션 서버**: http://localhost:3000 (PM2)

## 📁 프로젝트 구조

```
scs/
├── app/                    # App Router
├── components/             # 공통 컴포넌트
├── db/                     # 데이터베이스
├── scripts/                # 서버 관리 스크립트
├── tests/                  # Playwright 테스트
├── ecosystem.config.js     # PM2 설정
└── package.json           # 프로젝트 설정
```

## 🔧 환경 설정

1. 의존성 설치
```bash
npm install
```

2. 데이터베이스 마이그레이션
```bash
npm run db:migrate
```

3. 시드 데이터 생성
```bash
npm run db:seed
```

4. 테스트 실행
```bash
npm test
```

## 📝 로그 확인

PM2 로그는 다음 위치에서 확인할 수 있습니다:
- `logs/err.log` - 에러 로그
- `logs/out.log` - 출력 로그
- `logs/combined.log` - 통합 로그

실시간 로그 확인:
```bash
npm run pm2:logs
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
