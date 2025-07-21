const fs = require('fs')
const path = require('path')

// Get ngrok URL from command line argument
const ngrokUrl = process.argv[2]

if (!ngrokUrl) {
  console.log('Usage: node update-ngrok-url.js <ngrok-url>')
  console.log('Example: node update-ngrok-url.js https://abc123.ngrok.io')
  process.exit(1)
}

// Update .env.local file
const envPath = path.join(__dirname, '..', '.env.local')
let envContent = fs.readFileSync(envPath, 'utf8')

// Replace localhost URLs with ngrok URL
envContent = envContent.replace(/NEXTAUTH_URL=.*/g, `NEXTAUTH_URL=${ngrokUrl}`)
envContent = envContent.replace(/NEXT_PUBLIC_APP_URL=.*/g, `NEXT_PUBLIC_APP_URL=${ngrokUrl}`)

fs.writeFileSync(envPath, envContent)
console.log(`✅ Updated environment variables to use: ${ngrokUrl}`)
console.log('🔄 Please restart your development server for changes to take effect')
