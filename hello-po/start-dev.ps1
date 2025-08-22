# PowerShell script to run all development services
Write-Host "🚀 Starting MeeAI Development Environment" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Starting all required services..." -ForegroundColor Cyan

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$Title,
        [string]$Command,
        [string]$Color = "Blue"
    )
    
    Write-Host "▶️ Starting $Title..." -ForegroundColor $Color
    $powershellPath = (Get-Process -Id $PID).Path
    Start-Process $powershellPath -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '$Title' -ForegroundColor $Color; $Command"
    Start-Sleep -Seconds 2
}

# Start all services
Start-Service "Database Studio (Drizzle)" "npm run db:studio" "Green"
Start-Service "Inngest Dev Server" "npx inngest-cli@latest dev" "Magenta"
Start-Service "Webhook Tunnel (ngrok)" "npm run dev:webhook" "Yellow"
Start-Service "Next.js Development Server" "npm run dev" "Blue"

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Services running:" -ForegroundColor White
Write-Host "  🗄️  Database Studio: http://local.drizzle.studio" -ForegroundColor Green
Write-Host "  🔧 Inngest: http://localhost:8288" -ForegroundColor Magenta
Write-Host "  🌐 Webhook Tunnel: https://apparent-evenly-walrus.ngrok-free.app" -ForegroundColor Yellow
Write-Host "  🚀 Next.js App: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Press any key to continue or Ctrl+C to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
