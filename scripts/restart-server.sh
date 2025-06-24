#!/bin/bash

# SCS 서버 재시작 스크립트
echo "🔄 SCS 서버를 재시작합니다..."

# 프로젝트 디렉토리로 이동
cd /var/www/html/scs

# 기존 프로세스 중지
echo "📋 기존 프로세스 중지 중..."
pm2 stop scs-app 2>/dev/null || true

# 의존성 설치 확인
echo "📦 의존성 확인 중..."
npm install

# PM2로 서버 재시작
echo "🌟 PM2로 서버 재시작 중..."
pm2 restart scs-app || pm2 start ecosystem.config.js --env production

# 상태 확인
echo "📊 서버 상태 확인 중..."
pm2 status

echo "✅ 서버가 포트 3000에서 재시작되었습니다!"
echo "🌐 접속 주소: http://localhost:3000" 