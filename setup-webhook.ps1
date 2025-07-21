Write-Host ""
Write-Host "🚀 Xendit Webhook Setup for Development" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Step 1: Starting Next.js development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev:http"

Write-Host ""
Write-Host "⏳ Waiting 5 seconds for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "📋 Step 2: Starting ngrok tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 Your webhook URL will be shown below:" -ForegroundColor Cyan
Write-Host "   Copy the HTTPS URL and add '/api/xendit/webhook' to the end" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Example: https://abc123.ngrok.io/api/xendit/webhook" -ForegroundColor Green
Write-Host ""

try {
    & ngrok http 3000
} catch {
    Write-Host "❌ Error starting ngrok. Please try manual setup:" -ForegroundColor Red
    Write-Host "1. Open a new terminal" -ForegroundColor White
    Write-Host "2. Run: ngrok http 3000" -ForegroundColor White
    Write-Host "3. Copy the HTTPS URL from ngrok output" -ForegroundColor White
    Write-Host "4. Add '/api/xendit/webhook' to the end" -ForegroundColor White
}
