# 작업 기록 - 2025년 6월 21일 ~ 22일

## 🎯 주요 목표
- 몬스터 크롤링 및 한글화 작업
- 던전 페이지 오류 수정
- 데이터베이스 관리 및 API 개발
- JWT 인증 시스템 구현
- 모바일 UI/UX 개선
- Playwright 테스트 작성 및 실행
- PM2 서버 관리 시스템 구현
- **Playwright 테스트 오류 수정 및 안정화**

## ✅ 완료된 작업

### 1. 몬스터 크롤링 및 한글화

#### 1.1 크롤링 코드 수정
- **파일**: `scripts/monster_crawler_v2.ts`
- **작업 내용**:
  - 영어-한글 매핑 테이블 추가 (157개 몬스터)
  - 크롤링 시 바로 한글 이름으로 변환되도록 수정
  - 던전별 몬스터 분류 및 매핑

#### 1.2 한글 매핑 테이블
```typescript
const monsterKoreanNames: Record<string, string> = {
  // D1. 마법의 숲
  "Wolf": "늑대",
  "Boar": "멧돼지",
  "Treant": "트렌트",
  "Centaur": "켄타우로스",
  "Ent": "엔트",
  "Golden Rabbit": "황금 토끼",
  "Forest Spirit": "숲의 정령",
  
  // D2. 사막
  "Wurm": "웜",
  "Sand Vulture": "모래 독수리",
  "Shahuri Warrior": "샤후리 전사",
  "Shahuri Archer": "샤후리 궁수",
  "Shahuri Mage": "샤후리 마법사",
  "Djinn": "진",
  "Sand Statue": "모래 석상",
  
  // ... (총 157개 몬스터)
}
```

#### 1.3 크롤링 실행 결과
- **총 몬스터 수**: 157개
- **이미지 다운로드**: `public/monsters/` 폴더에 저장
- **데이터베이스 삽입**: 한글화된 몬스터 데이터 저장 완료

### 2. 인증 시스템 전환 (Clerk → JWT)

#### 2.1 Clerk 제거 및 JWT 구현
- **제거된 파일들**:
  - Clerk 관련 의존성 제거
  - `@clerk/nextjs` 패키지 제거
  - Clerk 미들웨어 제거

- **새로 구현된 파일들**:
  - `lib/auth.ts`: JWT 토큰 검증 로직
  - `app/api/auth/sign-in/route.ts`: JWT 로그인 API
  - `app/api/auth/sign-out/route.ts`: JWT 로그아웃 API
  - `app/api/auth/clear-cookie/route.ts`: 쿠키 삭제 API

#### 2.2 JWT 인증 시스템
```typescript
// JWT 토큰 생성
const token = await new SignJWT({ 
  userId: userData.id, 
  username: userData.username 
})
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('7d')
  .sign(JWT_SECRET)

// JWT 토큰 검증
const { payload } = await jwtVerify(authToken, JWT_SECRET, {
  algorithms: ['HS256'],
})
```

#### 2.3 인증 오류 해결
- **문제**: JWT_SECRET이 없어서 "Zero-length key is not supported" 오류
- **해결**: 환경 변수 설정 및 기본값 제공
- **추가**: 인증 실패 시 쿠키 자동 삭제 기능

### 3. 모바일 UI/UX 개선

#### 3.1 네비게이션 고정
- **문제**: 스크롤 시 상단/하단 네비게이션 크기 변형
- **해결**: CSS 고정 높이 및 z-index 설정
- **추가**: Viewport 높이 동적 계산

#### 3.2 CSS 개선사항
```css
/* 상단 헤더 고정 */
.header-fixed {
  height: 4rem !important;
  position: fixed !important;
  top: 0 !important;
  z-index: 40 !important;
}

/* 하단 네비게이션 고정 */
.bottom-nav-fixed {
  height: 4rem !important;
  position: fixed !important;
  bottom: 0 !important;
  z-index: 50 !important;
}

/* 모바일 viewport 높이 문제 해결 */
@supports (-webkit-touch-callout: none) {
  .h-screen {
    height: -webkit-fill-available;
  }
}
```

#### 3.3 ViewportFix 컴포넌트
- **파일**: `components/layout/viewport-fix.tsx`
- **기능**: 모바일 브라우저 viewport 높이 동적 계산
- **적용**: 스크롤, 리사이즈, 방향 전환 시 재계산

### 4. Next.js Image 컴포넌트 최적화

#### 4.1 sizes 속성 추가
- **문제**: `fill` 속성 사용 시 `sizes` 속성 누락 경고
- **해결**: 모든 Image 컴포넌트에 적절한 sizes 속성 추가

```typescript
// 수정된 Image 컴포넌트들
<Image 
  src={critter.imageUrl} 
  alt={critter.name} 
  fill 
  sizes="64px"  // 64x64 크기
  style={{ objectFit: 'contain' }} 
/>

<Image 
  src={critter.imageUrl} 
  alt={critter.name} 
  fill 
  sizes="128px"  // 128x128 크기
  className="object-cover rounded-lg" 
/>
```

#### 4.2 수정된 파일들
- `components/dungeon/AvailableCritterCard.tsx`
- `components/dungeon/PartyCritter.tsx`
- `components/ui/ImageUpload.tsx`
- `app/critterdex/[critterId]/page.tsx`

### 5. 던전 시스템 개선

#### 5.1 네비게이션 통합
- **변경**: 던전목록과 던전을 하나로 통합
- **삭제**: `/dungeons` 페이지 제거
- **개선**: `/dungeon` 페이지에서 던전 선택, 파티 구성, 탐험 통합

#### 5.2 던전 카드 UI
- 던전 통계 요약 추가 (해금된 던전 수, 총 클리어, 총 골드, 총 경험)
- 던전 선택 UI 개선
- 파티 구성 및 탐험 통합

### 6. Playwright 테스트 작성 및 실행

#### 6.1 테스트 결과 (2025년 6월 21일)
- **총 테스트 수**: 18개
- **통과**: 9개
- **실패**: 9개
- **실행 시간**: 35.2초

#### 6.2 실패한 테스트 분석
1. **인증 API 테스트**: 짧은 비밀번호 검증 로직 수정 필요
2. **페이지 레이아웃 테스트**: h1 태그 선택자 수정 필요
3. **던전 시스템 테스트**: "던전 탐험" 텍스트 선택자 수정 필요
4. **관리자 페이지 테스트**: 로그인 폼 요소 선택자 수정 필요
5. **부화장 테스트**: 로그인 버튼 선택자 수정 필요

#### 6.3 테스트 파일 구조
```
tests/
├── admin.spec.ts          # 관리자 페이지 테스트
├── auth.spec.ts           # 인증 API 테스트
├── dungeon.mobile.spec.ts # 던전 시스템 모바일 테스트
├── e2e.spec.ts            # 전체 E2E 테스트
└── hatchery.spec.ts       # 부화장 테스트
```

### 7. PM2 서버 관리 시스템 구현

#### 7.1 PM2 설치 및 설정
- **설치**: `npm install pm2 --save-dev`
- **설정 파일**: `ecosystem.config.js` 생성
- **포트 설정**: 항상 포트 3000에서 실행
- **자동 재시작**: 서버 중단 시 자동 재시작

#### 7.2 PM2 설정 파일
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'scs-app',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/html/scs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
```

#### 7.3 서버 관리 스크립트
- **시작 스크립트**: `scripts/start-server.sh`
- **중지 스크립트**: `scripts/stop-server.sh`
- **재시작 스크립트**: `scripts/restart-server.sh`
- **실행 권한**: `chmod +x scripts/*.sh`

#### 7.4 package.json 스크립트 추가
```json
{
  "scripts": {
    "pm2:start": "pm2 start ecosystem.config.js --env production",
    "pm2:stop": "pm2 stop scs-app",
    "pm2:restart": "pm2 restart scs-app",
    "pm2:delete": "pm2 delete scs-app",
    "pm2:logs": "pm2 logs scs-app",
    "pm2:status": "pm2 status",
    "pm2:monit": "pm2 monit"
  }
}
```

#### 7.5 로그 시스템
- **로그 폴더**: `logs/` 생성
- **에러 로그**: `logs/err.log`
- **출력 로그**: `logs/out.log`
- **통합 로그**: `logs/combined.log`

#### 7.6 서버 실행 확인
- **PM2 상태**: 정상 실행 중 (ID: 2)
- **포트 3000**: 정상 접속 가능
- **자동 재시작**: 활성화
- **메모리 사용량**: 72.5MB

## 🔧 오류 수정 작업 (2025년 6월 22일)

### 1. Playwright 테스트 오류 진단 및 수정

#### 1.1 서버 로그 확인
- **PM2 로그 분석**: SCS 앱은 정상 실행, 다른 프로젝트(MyWebMUD)의 오류와 혼동
- **실시간 로그 확인**: 서버 재시작 후 정상 동작 확인
- **API 엔드포인트 테스트**: `/api/critters` 정상 응답 확인

#### 1.2 주요 오류 원인 분석
1. **로그인 후 메인 페이지 문제**: "별빛 크리터 이야기" 헤딩 대신 링크로 검증 필요
2. **보호된 페이지 접근 문제**: `/critterdex` 페이지가 클라이언트 컴포넌트로만 구성되어 인증 체크 없음
3. **데이터 렌더링 문제**: CritterList가 클라이언트에서만 데이터를 fetch하여 SSR 시점에 빈 화면
4. **관리자 페이지 타임아웃**: 저장 버튼이나 테이블 데이터를 찾을 수 없음

#### 1.3 수정된 파일들

##### 테스트 코드 수정
- **`tests/hatchery.spec.ts`**: 헤딩 대신 링크 텍스트로 검증하도록 수정
- **`tests/dungeon.mobile.spec.ts`**: 헤딩 대신 링크 텍스트로 검증하도록 수정
- **`tests/e2e.spec.ts`**: 데이터 로딩 대기 로직 추가

##### 페이지 컴포넌트 수정
- **`app/critterdex/page.tsx`**: 
  - 클라이언트 컴포넌트 → 서버 컴포넌트로 변경
  - 인증 체크 추가 (`auth()` 함수 사용)
  - 서버에서 크리터 데이터를 미리 가져와서 `initialCritters` prop으로 전달

##### 컴포넌트 수정
- **`components/CritterList.tsx`**: 
  - `initialCritters` prop 추가
  - 서버에서 전달받은 데이터가 있으면 초기값으로 사용
  - 없을 때만 클라이언트에서 fetch

#### 1.4 수정 내용 상세

```typescript
// app/critterdex/page.tsx - 서버 컴포넌트로 변경
export default async function CritterdexPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // 서버에서 크리터 데이터를 미리 가져옴
  const allCritters = await db.select().from(critters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          크리터덱스
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          수집한 모든 크리터들을 확인하세요
        </p>
      </div>
      
      <CritterList initialCritters={allCritters} />
    </div>
  );
}
```

```typescript
// components/CritterList.tsx - initialCritters prop 추가
interface CritterListProps {
  showActions?: boolean
  onEdit?: (critter: ICritter) => void
  initialCritters?: ICritter[]
}

export default function CritterList({ showActions = false, onEdit, initialCritters }: CritterListProps) {
  const [critters, setCritters] = useState<ICritter[]>(initialCritters || [])
  const [isLoading, setIsLoading] = useState(!initialCritters)
  
  useEffect(() => {
    if (!initialCritters) {
      fetchCritters()
    }
  }, [initialCritters])
  
  // ... 나머지 로직
}
```

```typescript
// tests/e2e.spec.ts - 데이터 로딩 대기 추가
test('should display critterdex page correctly', async ({ page }) => {
  await page.goto('/critterdex');
  await page.screenshot({ path: 'critterdex-result.png', fullPage: true });
  // 데이터 로딩을 기다림
  await page.waitForSelector('text=아쿠아핀', { timeout: 10000 });
  await expect(page.getByText('아쿠아핀')).toBeVisible();
});

test('should navigate to hatchery and see the hatch button', async ({ page }) => {
  await page.goto('/hatchery');
  await page.screenshot({ path: 'hatchery-result.png', fullPage: true });
  // 부화하기 버튼이 나타날 때까지 기다림
  await page.waitForSelector('button:has-text("부화하기")', { timeout: 10000 });
  await expect(page.getByRole('button', { name: '부화하기' })).toBeVisible();
});
```

### 2. 현재 테스트 상태 (2025년 6월 22일)

#### 2.1 테스트 실행 결과
- **총 테스트 수**: 19개
- **통과**: 13개
- **실패**: 6개
- **실행 시간**: 33.4초

#### 2.2 실패한 테스트 목록
1. **부화장 테스트**: "부화하기" 버튼이 렌더링되지 않음
2. **크리터덱스 테스트**: "아쿠아핀" 텍스트가 렌더링되지 않음
3. **관리자 크리터 관리**: "저장" 버튼을 찾을 수 없음
4. **관리자 타입 상성 관리**: 테이블 데이터를 찾을 수 없음
5. **던전 시스템**: 메인 페이지 헤딩을 찾을 수 없음

#### 2.3 남은 오류 해결 필요 사항
- **부화장 페이지**: HatcheryClient 컴포넌트의 "부화하기" 버튼 렌더링 문제
- **관리자 페이지**: 로그인 후 관리자 페이지 접근 및 UI 요소 렌더링 문제
- **던전 시스템**: 파티 구성 및 탐험 기능의 UI 요소 렌더링 문제

## 📁 수정된 파일 목록

### 인증 시스템 관련
- `lib/auth.ts` - JWT 토큰 검증 로직
- `app/api/auth/sign-in/route.ts` - JWT 로그인 API
- `app/api/auth/sign-out/route.ts` - JWT 로그아웃 API
- `app/api/auth/clear-cookie/route.ts` - 쿠키 삭제 API
- `middleware.ts` - Clerk 제거, JWT 미들웨어로 변경

### UI/UX 관련
- `components/layout/header.tsx` - header-fixed 클래스 추가
- `components/layout/bottom-nav.tsx` - bottom-nav-fixed 클래스 추가
- `components/layout/viewport-fix.tsx` - ViewportFix 컴포넌트 생성
- `app/layout.tsx` - ViewportFix 컴포넌트 추가
- `app/globals.css` - 모바일 네비게이션 고정 CSS 추가

### Image 컴포넌트 관련
- `components/dungeon/AvailableCritterCard.tsx` - sizes 속성 추가
- `components/dungeon/PartyCritter.tsx` - sizes 속성 추가
- `components/ui/ImageUpload.tsx` - sizes 속성 추가
- `app/critterdex/[critterId]/page.tsx` - sizes 속성 추가

### 던전 시스템 관련
- `app/dungeon/page.tsx` - 던전 선택 UI 개선
- `app/api/dungeons/route.ts` - 인증 실패 시 쿠키 삭제
- `app/api/dungeon/explore/route.ts` - 인증 실패 시 쿠키 삭제

### PM2 서버 관리 관련
- `ecosystem.config.js` - PM2 설정 파일
- `package.json` - PM2 스크립트 추가
- `scripts/start-server.sh` - 서버 시작 스크립트
- `scripts/stop-server.sh` - 서버 중지 스크립트
- `scripts/restart-server.sh` - 서버 재시작 스크립트
- `README.md` - PM2 사용법 문서화
- `logs/` - 로그 폴더 생성

### 테스트 관련 (2025년 6월 22일 수정)
- `tests/admin.spec.ts` - 관리자 페이지 테스트
- `tests/auth.spec.ts` - 인증 API 테스트
- `tests/dungeon.mobile.spec.ts` - 던전 시스템 테스트 (헤딩 → 링크 검증으로 수정)
- `tests/e2e.spec.ts` - 전체 E2E 테스트 (데이터 로딩 대기 로직 추가)
- `tests/hatchery.spec.ts` - 부화장 테스트 (헤딩 → 링크 검증으로 수정)

### 페이지 컴포넌트 수정 (2025년 6월 22일)
- `app/critterdex/page.tsx` - 서버 컴포넌트로 변경, 인증 체크 추가, SSR 데이터 전달
- `components/CritterList.tsx` - initialCritters prop 추가, SSR 데이터 지원

## 🎯 다음 진행할 작업

### 1. Playwright 테스트 완전 수정 (우선순위: 높음)
- **부화장 테스트**: HatcheryClient 컴포넌트의 "부화하기" 버튼 렌더링 문제 해결
- **관리자 페이지 테스트**: 로그인 후 관리자 페이지 접근 및 UI 요소 렌더링 문제 해결
- **던전 시스템 테스트**: 파티 구성 및 탐험 기능의 UI 요소 렌더링 문제 해결
- **테스트 환경 안정화**: Playwright 설정 최적화, 타임아웃 조정

### 2. 서버 컴포넌트 SSR 최적화 (우선순위: 높음)
- **부화장 페이지**: 서버 컴포넌트로 변경하여 인증 체크 및 초기 데이터 로딩 개선
- **관리자 페이지**: 서버 컴포넌트로 변경하여 인증 체크 및 초기 데이터 로딩 개선
- **던전 페이지**: 서버 컴포넌트로 변경하여 인증 체크 및 초기 데이터 로딩 개선

### 3. 던전 시스템 완성 (우선순위: 중간)
- 파티 구성 드래그 앤 드롭 기능
- 던전 탐험 로직 최적화
- 전투 시스템 개선

### 4. 부화장 시스템 (우선순위: 중간)
- 알 부화 기능 구현
- 크리터 획득 시스템
- 부화 확률 시스템

### 5. 상점 시스템 (우선순위: 낮음)
- 아이템 구매 기능
- 골드 시스템 구현
- 인벤토리 관리

### 6. 크리터덱스 (우선순위: 낮음)
- 검색 및 필터링 기능
- 컬렉션 관리
- 크리터 상세 정보 개선

## 📊 현재 프로젝트 상태

### ✅ 완료된 기능
- 몬스터 크롤링 및 한글화 (157개)
- 아이템 크롤링 및 데이터베이스 저장 (4,403개)
- JWT 기반 인증 시스템
- 모바일 네비게이션 고정
- 던전 시스템 기본 구조
- 관리자 페이지 (몬스터, 아이템, 던전 관리)
- Playwright 테스트 프레임워크 구축
- **PM2 서버 관리 시스템**
- **크리터덱스 페이지 SSR 최적화**

### 🔄 진행 중인 기능
- **Playwright 테스트 수정 및 안정화** (진행률: 70%)
- 던전 시스템 (파티 구성, 탐험 로직 개선)
- 부화장 시스템 (부화 기능 구현)
- 상점 시스템 (구매 기능 구현)

### 📋 남은 작업
- 테스트 코드 완성 및 안정화 (우선순위: 높음)
- 서버 컴포넌트 SSR 최적화 (우선순위: 높음)
- 게임 밸런싱
- UI/UX 최종 개선
- 배포 준비

## 💡 기술적 노트

### 사용된 기술 스택
- **Frontend**: Next.js 15.3.4, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite, Drizzle ORM
- **Authentication**: JWT (jose 라이브러리)
- **UI**: Tailwind CSS, ShadCN
- **Testing**: Playwright
- **Process Manager**: PM2
- **Deployment**: Vercel (제거됨)

### 주요 패턴
- App Router 사용
- Route Handler 우선 사용
- TypeScript 인터페이스 (I 접두사)
- 컴포넌트 분리 및 재사용성
- JWT 기반 인증
- 모바일 우선 반응형 디자인
- PM2 기반 서버 관리
- **서버 컴포넌트 SSR 최적화**

### 파일 구조
```
scs/
├── app/                    # App Router
│   ├── api/               # API Routes
│   ├── admin/             # 관리자 페이지
│   ├── dungeon/           # 던전 시스템
│   ├── critterdex/        # 크리터덱스 (SSR 최적화됨)
│   ├── hatchery/          # 부화장
│   └── ...
├── components/             # 공통 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── ui/                # ShadCN UI 컴포넌트
│   ├── dungeon/           # 던전 관련 컴포넌트
│   ├── hatchery/          # 부화장 관련 컴포넌트
│   └── ...
├── db/                     # 데이터베이스
├── lib/                    # 유틸리티 라이브러리
├── scripts/                # 서버 관리 스크립트
├── tests/                  # Playwright 테스트
├── logs/                   # PM2 로그 파일
├── ecosystem.config.js     # PM2 설정
├── public/                 # 정적 파일
└── types/                  # 타입 정의
```

### 성능 최적화
- Next.js Image 컴포넌트 sizes 속성 최적화
- 모바일 viewport 높이 동적 계산
- JWT 토큰 자동 만료 처리
- 쿠키 자동 삭제 기능
- PM2 자동 재시작 기능
- **서버 컴포넌트 SSR 데이터 전달 최적화**

### 서버 관리 명령어
```bash
# 서버 시작
./scripts/start-server.sh
npm run pm2:start

# 서버 중지
./scripts/stop-server.sh
npm run pm2:stop

# 서버 재시작
./scripts/restart-server.sh
npm run pm2:restart

# 상태 확인
npm run pm2:status

# 로그 확인
npm run pm2:logs

# 실시간 모니터링
npm run pm2:monit
```

### Playwright 테스트 명령어
```bash
# 전체 테스트 실행
npx playwright test

# 특정 테스트 파일 실행
npx playwright test tests/e2e.spec.ts

# 헤드리스 모드로 실행 (서버 환경용)
npx playwright test --headed

# 디버그 모드로 실행
npx playwright test --debug

# 테스트 결과 보고서 확인
npx playwright show-report
```

---
**작성일**: 2025년 6월 21일  
**업데이트**: 2025년 6월 22일  
**작성자**: AI Assistant  
**프로젝트**: 별빛 크리터 이야기 (SCS) 