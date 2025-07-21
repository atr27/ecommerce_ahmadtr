#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Xendit Webhook Development Setup\n');

// Check if ngrok is installed
function checkNgrok() {
  try {
    execSync('ngrok version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install ngrok if not present
function installNgrok() {
  console.log('📦 Installing ngrok...');
  try {
    execSync('npm install -g ngrok', { stdio: 'inherit' });
    console.log('✅ ngrok installed successfully\n');
  } catch (error) {
    console.log('❌ Failed to install ngrok automatically');
    console.log('Please install manually: npm install -g ngrok');
    console.log('Or download from: https://ngrok.com/download\n');
    process.exit(1);
  }
}

// Check if development server is running
function checkDevServer() {
  try {
    const response = require('http').get('http://localhost:3000', (res) => {
      return true;
    });
    response.on('error', () => {
      return false;
    });
  } catch (error) {
    return false;
  }
}

// Start ngrok tunnel
function startNgrok() {
  console.log('🌐 Starting ngrok tunnel...');
  
  const ngrok = spawn('ngrok', ['http', '3000'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  
  ngrok.stdout.on('data', (data) => {
    output += data.toString();
  });

  ngrok.stderr.on('data', (data) => {
    output += data.toString();
  });

  // Wait a moment for ngrok to start
  setTimeout(() => {
    // Try to extract the URL from ngrok API
    try {
      const http = require('http');
      const req = http.get('http://localhost:4040/api/tunnels', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const tunnels = JSON.parse(data);
            const httpsUrl = tunnels.tunnels.find(t => t.proto === 'https')?.public_url;
            
            if (httpsUrl) {
              console.log('✅ ngrok tunnel created successfully!\n');
              console.log('🔗 Your webhook URL:');
              console.log(`   ${httpsUrl}/api/xendit/webhook\n`);
              
              console.log('📋 Next steps:');
              console.log('1. Copy the webhook URL above');
              console.log('2. Go to Xendit Dashboard → Settings → Webhooks');
              console.log('3. Add new webhook with the URL above');
              console.log('4. Select events: invoice.paid, invoice.expired, invoice.failed');
              console.log('5. Copy the Webhook Token and add to your .env.local file\n');
              
              console.log('⚠️  Keep this terminal open while testing webhooks');
              console.log('   Press Ctrl+C to stop the tunnel\n');
            }
          } catch (e) {
            console.log('⚠️  ngrok started but couldn\'t get tunnel URL automatically');
            console.log('   Check the ngrok web interface at: http://localhost:4040');
          }
        });
      });
      
      req.on('error', () => {
        console.log('⚠️  ngrok started but couldn\'t get tunnel URL automatically');
        console.log('   Check the ngrok web interface at: http://localhost:4040');
      });
      
    } catch (error) {
      console.log('⚠️  ngrok started but couldn\'t get tunnel URL automatically');
      console.log('   Check the ngrok web interface at: http://localhost:4040');
    }
  }, 3000);

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping ngrok tunnel...');
    ngrok.kill();
    process.exit(0);
  });
}

// Main execution
async function main() {
  // Check if ngrok is installed
  if (!checkNgrok()) {
    console.log('❌ ngrok not found');
    installNgrok();
  } else {
    console.log('✅ ngrok is installed\n');
  }

  // Check if dev server is running
  console.log('🔍 Checking if development server is running on port 3000...');
  
  // Simple check by trying to connect
  const net = require('net');
  const client = new net.Socket();
  
  client.setTimeout(1000);
  
  client.on('connect', () => {
    console.log('✅ Development server is running\n');
    client.destroy();
    startNgrok();
  });
  
  client.on('timeout', () => {
    console.log('❌ Development server not running on port 3000');
    console.log('   Please start your dev server first: npm run dev\n');
    client.destroy();
    process.exit(1);
  });
  
  client.on('error', () => {
    console.log('❌ Development server not running on port 3000');
    console.log('   Please start your dev server first: npm run dev\n');
    process.exit(1);
  });
  
  client.connect(3000, 'localhost');
}

main().catch(console.error);
