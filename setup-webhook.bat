@echo off
echo.
echo 🚀 Xendit Webhook Setup for Development
echo.

echo 📋 Step 1: Starting Next.js development server...
start "Next.js Dev Server" cmd /k "npm run dev:http"

echo.
echo ⏳ Waiting 5 seconds for server to start...
timeout /t 5 /nobreak > nul

echo.
echo 📋 Step 2: Starting ngrok tunnel...
echo.
echo 🔗 Your webhook URL will be shown below:
echo    Copy the HTTPS URL and add '/api/xendit/webhook' to the end
echo.
echo 📝 Example: https://abc123.ngrok.io/api/xendit/webhook
echo.

ngrok http 3000
