#!/bin/bash
# scripts/init_python_venv.sh
# 파이썬 venv 자동 생성 및 초기화 스크립트 (macOS/Linux)

cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
  echo "[venv] 가상환경 생성 중..."
  python3 -m venv venv
else
  echo "[venv] 가상환경이 이미 존재합니다."
fi

echo "\n[macOS/Linux] 가상환경 활성화:"
echo "source venv/bin/activate"

echo "\n패키지 설치 예시:"
echo "pip install -r requirements.txt"

echo "\n파이썬 스크립트 실행 예시:"
echo "python update_dungeon_unlock_requirements_v2.py"

echo "\n가상환경 비활성화:"
echo "deactivate"
