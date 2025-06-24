#!/bin/bash

# SCS 서버 중지 스크립트
echo "🛑 SCS 서버를 중지합니다..."

# 프로젝트 디렉토리로 이동
cd /var/www/html/scs

# PM2 프로세스 중지
echo "📋 PM2 프로세스 중지 중..."
pm2 stop scs-app

# PM2 프로세스 삭제
echo "🗑️ PM2 프로세스 삭제 중..."
pm2 delete scs-app

# 상태 확인
echo "📊 PM2 상태 확인 중..."
pm2 status

echo "✅ 서버가 중지되었습니다!" 