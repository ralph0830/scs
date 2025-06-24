## Next.js: Route Handler 우선 사용

-   **모든 API 엔드포인트는 Route Handler를 사용하여 구현하세요.**
-   **데이터베이스 작업, 외부 API 호출, 인증 등 복잡한 서버 작업은 반드시 Route Handler를 사용하세요.**
-   **Server Action은 단순 폼 제출 또는 간단한 데이터 처리에만 사용하세요.**

---

## Next.js 라우팅: App Router 사용

-   **프로젝트 내 라우팅은 Pages Router 대신 App Router를 사용하세요.**

---

## 프로젝트 구조: 주요 폴더 구조 예시

-   **프로젝트 구조는 다음과 같이 설정하세요. `src` 폴더는 사용하지 않습니다.**

```
your-nextjs-project/
│
├── app/                      # App Router 라우트 폴더
│ ├── api/                    # API 엔드포인트 관련 폴더
│ ├── dashboard/              # 개별 페이지 폴더 예시 (재사용되지 않는 컴포넌트 포함)
│ └─├── page.tsx              # dashboard 페이지
│   └── DashboardStats.tsx    # 페이지 전용 컴포넌트
├── components/               # 공통 컴포넌트 모음
│ ├── ui                      # ShadCN 공통 UI 컴포넌트
│ │ ├── button.tsx
│ │ ├── input.tsx
│ │ ├── select.tsx
│ │ ├── toast.tsx
│ │ ├── toaster.tsx
│ ├── layout/                 # 레이아웃 관련 공통 컴포넌트
│ │ ├── header.tsx
│ │ ├── footer.tsx
│ │ ├── sidebar.tsx
│ ├── OptionsDropdown.tsx
│ ├── PromptInput.tsx
│ └── GeneratedImagePreview.tsx
│
├── store/                    # 상태 관리 관련 폴더
│ ├── gallery.ts              # 갤러리 관련 상태 관리
│ ├── auth.ts                 # 인증 관련 상태 관리
│ ├── community.ts            # 커뮤니티 관련 상태 관리
│ └── index.ts                # 상태 관리 유틸리티 및 타입 정의
│
├── hooks/                    # 커스텀 훅 폴더
│ ├── use-toast.ts            # 토스트 관련 훅
│ ├── use-auth.ts             # 인증 관련 훅
│ └── use-media.ts            # 미디어 쿼리 등 UI 관련 훅
│
├── db/                       # 데이터베이스 관련 폴더
│ ├── schema.ts               # DrizzleORM 스키마 정의 파일
│ └── index.ts                # 데이터베이스 연결 초기화 파일
│
├── drizzle/                  # DrizzleORM 관련 설정 파일
│
├── public/                   # 정적 파일 (이미지, 폰트 등)
│ └── favicon.ico
│
├── styles/                   # 글로벌 스타일 (CSS, SCSS, Tailwind 등)
│ └── globals.css
│
├── types/                    # 공통 인터페이스 및 타입 정의
│ └── index.ts                # 여러 파일에서 사용할 공통 타입 및 인터페이스 정의 파일
│
├── utils/                    # 유틸리티 함수 모음
│ ├── fetcher.ts              # API 호출 등 유틸리티 함수
│ └── mockData.ts             # 목업 데이터 관리
│
├── scripts/                  # 서버 관리 스크립트
│ ├── start-server.sh         # 서버 시작 스크립트
│ ├── stop-server.sh          # 서버 중지 스크립트
│ └── restart-server.sh       # 서버 재시작 스크립트
│
├── logs/                     # PM2 로그 파일
│ ├── err.log                 # 에러 로그
│ ├── out.log                 # 출력 로그
│ └── combined.log            # 통합 로그
│
├── middleware.ts             # 미들웨어 설정 파일
├── .env                      # 환경 변수 설정 파일
├── drizzle.config.ts         # DrizzleORM 설정 파일
├── next.config.mjs           # Next.js 설정 파일
├── package.json              # 프로젝트 패키지 정보
├── ecosystem.config.js       # PM2 설정 파일
└── tsconfig.json             # TypeScript 설정 파일

```

---

## TypeScript 사용: TS 사용 권장

-   **프로젝트 전반에 TypeScript를 사용하세요.**
-   **타입 안정성을 위해 모든 컴포넌트와 서버 로직에 TypeScript를 적용하세요.**

---

## TypeScript 인터페이스 정의 규칙: 'I' 접두사 사용

-   **인터페이스 정의 시 이름 앞에 'I'를 접두사로 추가하세요.**
-   예시:
    ```typescript
    export interface IComment {
        id: string
        text: string
        author: string
    }
    ```
-   인터페이스 생성은 types/index.ts 파일에 작성하세요.

---

## 컴포넌트 생성: ShadCN 우선 사용

-   **모든 UI 컴포넌트는 ShadCN을 우선으로 생성하세요.**
-   ShadCN 컴포넌트 생성 CLI 명령어는 `npx shadcn@latest add`입니다.
-   **Toast 관련 컴포넌트는 다음 위치에 있습니다:**
    ```
    components/ui/toast.tsx      # Toast 기본 컴포넌트
    components/ui/toaster.tsx    # Toast 컨테이너 컴포넌트
    hooks/use-toast.ts   # Toast 커스텀 훅
    ```

---

## Git 커밋 메시지 작성 규칙

**포맷:**

```
<type>: <subject>

<body>
```

**커밋 타입 (Type):**

-   feat: 새로운 기능 추가
-   fix: 버그 수정
-   docs: 문서 수정
-   style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
-   refactor: 코드 리팩토링
-   test: 테스트 코드, 리팩토링 테스트 코드 추가
-   chore: 빌드 업무 수정, 패키지 매니저 수정

**제목 (Subject):**

-   변경 사항에 대한 간단한 설명
-   50자 이내로 작성
-   마침표 없이 작성
-   현재 시제 사용

**본문 (Body):**

-   변경 사항에 대한 자세한 설명
-   어떻게 보다는 무엇을, 왜 변경했는지 설명
-   여러 줄의 메시지를 작성할 땐 "-"로 구분

**예시:**

```plaintext
feat: 로그인 화면 키보드 UX 개선
- TextInput ref를 사용하여 자동 포커스 기능 추가
- returnKeyType 설정으로 키보드 엔터키 동작 개선
- 전화번호 입력 후 자동으로 비밀번호 입력창으로 포커스 이동
- 비밀번호 입력 후 엔터키로 로그인 가능하도록 개선
```

## 인증 시스템: 로컬 데이터베이스 관리

-   **Clerk 인증을 사용하지 않고 로컬 데이터베이스로 사용자 관리합니다.**
-   **사용자 정보, 세션, 인증 상태는 모두 로컬 SQLite 데이터베이스에서 관리합니다.**
-   **API 엔드포인트에서는 세션 토큰이나 사용자 ID를 통해 인증을 확인합니다.**
-   **미들웨어는 단순한 라우트 보호만 수행하며, 복잡한 인증 로직은 Route Handler에서 처리합니다.**

---

## ORM: Drizzle 사용

-   **데이터베이스 작업을 위해 ORM으로 Drizzle을 사용하세요.**
-   **Drizzle을 사용하여 데이터베이스 모델을 정의하고, CRUD 작업을 구현하세요.**

---

## 서버 관리: PM2 사용

-   **프로덕션 환경에서는 PM2를 사용하여 서버를 관리하세요.**
-   **PM2를 통해 서버가 백그라운드에서 지속적으로 실행되도록 합니다.**
-   **Cursor AI를 종료해도 서버가 계속 실행되도록 PM2를 사용합니다.**

### PM2 설정 파일
-   **ecosystem.config.js**: PM2 설정 파일
-   **포트 3000에서 항상 실행되도록 설정**
-   **자동 재시작 기능 활성화**

### 서버 관리 스크립트
-   **scripts/start-server.sh**: 서버 시작 스크립트
-   **scripts/stop-server.sh**: 서버 중지 스크립트
-   **scripts/restart-server.sh**: 서버 재시작 스크립트

### PM2 명령어
```bash
# 서버 시작
npm run pm2:start
./scripts/start-server.sh

# 서버 중지
npm run pm2:stop
./scripts/stop-server.sh

# 서버 재시작
npm run pm2:restart
./scripts/restart-server.sh

# 상태 확인
npm run pm2:status

# 로그 확인
npm run pm2:logs

# 실시간 모니터링
npm run pm2:monit
```

### 로그 관리
-   **logs/err.log**: 에러 로그
-   **logs/out.log**: 출력 로그
-   **logs/combined.log**: 통합 로그

---

## 아키텍처 개요 (프론트엔드 및 백엔드)

`prd_develop.txt`에 명시된 규칙에 따라 개발을 진행할 경우, 프론트엔드와 백엔드는 다음과 같이 구성됩니다.

핵심적으로, 이 프로젝트는 전통적인 프론트엔드와 백엔드가 분리된 구조가 아닌, **Next.js를 사용한 통합 풀스택 애플리케이션** 형태가 됩니다. 모든 코드는 하나의 프로젝트 내에서 관리됩니다.

### 프론트엔드 (Client-Side)

프론트엔드는 사용자에게 보여지는 화면과 상호작용을 담당합니다.

1.  **프레임워크 및 언어**:
    *   **Next.js (App Router)**: 모든 페이지 라우팅과 렌더링을 담당합니다.
    *   **React**: UI를 구성하는 기본 라이브러리입니다.
    *   **TypeScript**: 코드 전체에 적용되어 타입 안정성을 보장합니다.

2.  **UI 개발**:
    *   **ShadCN/UI**: `Button`, `Input`, `Toast` 등 모든 핵심 UI 컴포넌트는 ShadCN을 사용하여 구축합니다. 이는 Tailwind CSS를 기반으로 스타일링됨을 의미합니다.
    *   **컴포넌트 구조**:
        *   `components/ui/`: ShadCN을 통해 생성된 공통 UI 컴포넌트들이 위치합니다.
        *   `components/layout/`: `Header`, `Footer` 등 레이아웃 관련 컴포넌트가 위치합니다.
        *   `components/`: 그 외 재사용 가능한 공통 컴포넌트들을 이곳에서 관리합니다.
        *   페이지에만 종속적인 컴포넌트는 해당 페이지 폴더(예: `app/dashboard/DashboardStats.tsx`) 내에 둡니다.

3.  **상태 관리 및 로직**:
    *   `store/`: `Zustand`나 `Jotai` 같은 상태 관리 라이브러리를 사용하여 전역 상태(예: 유저 정보, 갤러리 데이터)를 관리합니다.
    *   `hooks/`: `use-toast`, `use-auth`와 같이 반복되는 로직이나 커스텀 훅을 만들어 사용합니다.

4.  **백엔드와 통신**:
    *   `utils/fetcher.ts` 와 같은 유틸리티 함수를 통해 백엔드 API(Route Handlers)에 데이터를 요청하고 응답을 처리합니다.

### 백엔드 (Server-Side)

백엔드는 별도의 서버 애플리케이션(예: Express, NestJS)으로 존재하는 것이 아니라, **Next.js 프레임워크 내에 통합된 형태**로 구현됩니다.

1.  **API 엔드포인트**:
    *   **Route Handlers**: 모든 API는 `app/api/` 경로 내에 Route Handler를 사용하여 구현됩니다. 예를 들어, `app/api/posts/route.ts` 파일이 `/api/posts` 엔드포인트가 됩니다.
    *   데이터베이스 조회/수정, 외부 API 호출, 인증 처리 등 모든 서버의 핵심 로직은 Route Handler 안에서 수행됩니다.
    *   **Server Action**은 폼 제출과 같은 간단한 작업에만 제한적으로 사용됩니다.

2.  **데이터베이스**:
    *   **Drizzle ORM**: 데이터베이스와의 모든 상호작용은 Drizzle ORM을 통해 이루어집니다.
    *   **SQLite**: 로컬 개발 환경에서는 SQLite 데이터베이스를 사용합니다.
    *   `db/schema.ts`: Drizzle을 사용하여 데이터베이스 테이블 스키마를 정의합니다.
    *   `db/index.ts`: 데이터베이스 연결을 초기화하는 코드가 위치합니다.

3.  **인증**:
    *   **로컬 인증 시스템**: 사용자 회원가입, 로그인, 세션 관리는 모두 로컬 데이터베이스를 통해 처리됩니다.
    *   **세션 관리**: JWT 토큰이나 세션 ID를 사용하여 사용자 인증 상태를 관리합니다.
    *   **Route Handler 인증**: API 엔드포인트에서 세션 토큰을 검증하여 인증된 사용자만 접근할 수 있도록 합니다.

4.  **서버 관리**:
    *   **PM2**: 프로덕션 환경에서 서버를 관리하는 프로세스 매니저입니다.
    *   **포트 3000**: 항상 포트 3000에서 실행되도록 설정됩니다.
    *   **자동 재시작**: 서버가 중단되면 자동으로 재시작됩니다.
    *   **로그 관리**: 에러, 출력, 통합 로그를 별도로 관리합니다.

### 요약

| 구분       | 기술 스택 및 역할                                                                                                     |
| :--------- | :-------------------------------------------------------------------------------------------------------------------- |
| **공통**   | Next.js, TypeScript, 단일 Git 레포지토리                                                                                |
| **프론트엔드** | React, ShadCN/UI, Tailwind CSS, Zustand (상태 관리), `app/` 폴더 기반 라우팅                                             |
| **백엔드**   | Next.js Route Handlers (API 구현), Drizzle (ORM), SQLite (로컬 데이터베이스), 로컬 인증 시스템, PM2 (서버 관리)       |

결론적으로, `prd_develop.txt`의 규칙은 **Next.js App Router를 중심으로 한 최신 풀스택 개발 방식**을 지향하고 있습니다. 프론트엔드와 백엔드 코드가 같은 프로젝트에 존재하여 개발 효율성을 높이고, 각 영역의 역할은 정해진 규칙(Route Handler, Drizzle, 로컬 인증, PM2 등)에 따라 명확하게 분리됩니다.
