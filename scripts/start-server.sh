#!/bin/bash

# SCS 서버 시작 스크립트
echo "🚀 SCS 서버를 시작합니다..."

# 프로젝트 디렉토리로 이동
cd /var/www/html/scs

# 기존 PM2 프로세스가 있다면 중지
echo "📋 기존 프로세스 확인 중..."
pm2 stop scs-app 2>/dev/null || true
pm2 delete scs-app 2>/dev/null || true

# 의존성 설치 확인
echo "📦 의존성 확인 중..."
npm install

# PM2로 서버 시작 (개발 모드)
echo "🌟 PM2로 서버 시작 중..."
pm2 start ecosystem.config.js --env production

# 상태 확인
echo "📊 서버 상태 확인 중..."
pm2 status

echo "✅ 서버가 포트 3000에서 실행 중입니다!"
echo "🌐 접속 주소: http://localhost:3000"
echo ""
echo "📋 유용한 명령어:"
echo "  - 서버 상태 확인: npm run pm2:status"
echo "  - 로그 확인: npm run pm2:logs"
echo "  - 서버 재시작: npm run pm2:restart"
echo "  - 서버 중지: npm run pm2:stop"
echo "  - 모니터링: npm run pm2:monit" 