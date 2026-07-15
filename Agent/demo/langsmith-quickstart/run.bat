@echo off

echo 【LangSmith 快速启动器 v2】
echo.

:: 检查 Python
echo 正在检查 Python 环境...
python --version >nul 2>&1 || (echo ❌ 错误：未找到 Python，请先安装 Python 3.10+ && pause && exit /b)

:: 创建虚拟环境（首次运行）
if not exist "venv" (
    echo 🌱 正在创建虚拟环境...
    python -m venv venv
)

:: 激活并安装依赖
call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
echo ✅ 依赖已就绪

:: 启动 LangSmith 本地服务（关键修复：显式 host/port）
echo 🚀 正在启动 LangSmith 本地服务（http://localhost:1984）...
start "LangSmith UI" http://localhost:1984

:: 后台静默启动，避免 cmd 卡住
start /min cmd /c "langsmith dev --host 0.0.0.0 --port 1984 > langsmith.log 2>&1"

echo ⏳ 启动中... 请等待 5 秒
ping -n 5 127.0.0.1 >nul

echo 🌐 验证服务是否就绪...
curl -s http://localhost:1984/health | findstr "ok" >nul
if %errorlevel% equ 0 (
    echo ✅ LangSmith 服务已就绪！
) else (
    echo ❌ LangSmith 服务启动失败，请查看 langsmith.log
    pause
    exit /b
)

:: 运行 demo
echo 🧪 正在运行 RAG Agent 示例...
python app.py

echo.
echo ✅ 执行完成！
echo 💡 提示：刷新 http://localhost:1984 查看 trace
echo.
pause