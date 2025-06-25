@echo off
REM scripts/init_python_venv.bat
REM 파이썬 venv 자동 생성 및 초기화 스크립트 (Windows 전용, scripts/ 폴더 기준)

cd /d %~dp0

if not exist venv (
    echo [venv] 가상환경 생성 중...
    python -m venv venv
) else (
    echo [venv] 가상환경이 이미 존재합니다.
)

echo.
echo [Windows] 가상환경 활성화:
echo .\venv\Scripts\activate

echo.
echo 패키지 설치 예시:
echo pip install -r requirements.txt

echo.
echo 파이썬 스크립트 실행 예시:
echo python update_dungeon_unlock_requirements_v2.py

echo.
echo 가상환경 비활성화:
echo deactivate
