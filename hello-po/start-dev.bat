@echo off
echo 🚀 Starting MeeAI Development Environment

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📋 Starting all required services...

REM Start Database Studio
echo ▶️ Starting Database Studio...
start "Database Studio (Drizzle)" cmd /k "npm run db:studio"
timeout /t 2 /nobreak >nul

REM Start Inngest Dev Server
echo ▶️ Starting Inngest Dev Server...
start "Inngest Dev Server" cmd /k "npx inngest-cli@latest dev"
timeout /t 2 /nobreak >nul

REM Start Webhook Tunnel
echo ▶️ Starting Webhook Tunnel...
start "Webhook Tunnel (ngrok)" cmd /k "npm run dev:webhook"
timeout /t 2 /nobreak >nul

REM Start Next.js Development Server
echo ▶️ Starting Next.js Development Server...
start "Next.js Development Server" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul

echo ✅ All services started!
echo.
echo 📝 Services running:
echo   🗄️  Database Studio: http://local.drizzle.studio
echo   🔧 Inngest: http://localhost:8288
echo   🌐 Webhook Tunnel: https://apparent-evenly-walrus.ngrok-free.app
echo   🚀 Next.js App: http://localhost:3000
echo.
echo 💡 Press any key to continue...
pause >nul
