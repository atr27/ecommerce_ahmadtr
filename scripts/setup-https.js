#!/usr/bin/env node

/**
 * HTTPS Setup Helper Script
 * 
 * This script helps you quickly set up HTTPS for development using ngrok.
 * It will guide you through the process and update your environment variables.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Check if ngrok is installed
 */
function checkNgrokInstalled() {
  return new Promise((resolve) => {
    const ngrok = spawn('ngrok', ['--version'], { shell: true });
    
    ngrok.on('close', (code) => {
      resolve(code === 0);
    });
    
    ngrok.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Install ngrok
 */
function installNgrok() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing ngrok...');
    
    const npm = spawn('npm', ['install', '-g', 'ngrok'], { 
      shell: true,
      stdio: 'inherit'
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        console.log('✅ ngrok installed successfully!');
        resolve();
      } else {
        reject(new Error('Failed to install ngrok'));
      }
    });
  });
}

/**
 * Update .env.local file with HTTPS URL
 */
function updateEnvFile(httpsUrl) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update NEXTAUTH_URL and add NEXT_PUBLIC_APP_URL
  const lines = envContent.split('\n');
  let updatedLines = [];
  let foundNextAuthUrl = false;
  let foundAppUrl = false;

  for (const line of lines) {
    if (line.startsWith('NEXTAUTH_URL=')) {
      updatedLines.push(`NEXTAUTH_URL=${httpsUrl}`);
      foundNextAuthUrl = true;
    } else if (line.startsWith('NEXT_PUBLIC_APP_URL=')) {
      updatedLines.push(`NEXT_PUBLIC_APP_URL=${httpsUrl}`);
      foundAppUrl = true;
    } else {
      updatedLines.push(line);
    }
  }

  // Add missing environment variables
  if (!foundNextAuthUrl) {
    updatedLines.push(`NEXTAUTH_URL=${httpsUrl}`);
  }
  if (!foundAppUrl) {
    updatedLines.push(`NEXT_PUBLIC_APP_URL=${httpsUrl}`);
  }

  // Write back to file
  fs.writeFileSync(envPath, updatedLines.join('\n'));
  console.log('✅ Updated .env.local with HTTPS URL');
}

/**
 * Display OAuth provider configuration instructions
 */
function displayOAuthInstructions(httpsUrl) {
  console.log('\n📋 OAuth Provider Configuration:');
  console.log('=====================================');
  
  console.log('\n🔹 Supabase Auth:');
  console.log('1. Go to Supabase Dashboard → Authentication → URL Configuration');
  console.log(`2. Set Site URL: ${httpsUrl}`);
  console.log(`3. Add Redirect URL: ${httpsUrl}/auth/callback`);
  
  console.log('\n🔹 IGDB/Twitch:');
  console.log('1. Go to https://dev.twitch.tv/console');
  console.log('2. Edit your application');
  console.log(`3. Add OAuth Redirect URI: ${httpsUrl}/auth/callback`);
  
  console.log('\n🔹 Google OAuth (if using):');
  console.log('1. Go to Google Cloud Console → APIs & Services → Credentials');
  console.log('2. Edit your OAuth 2.0 client');
  console.log(`3. Add Authorized redirect URI: ${httpsUrl}/auth/callback`);
}

/**
 * Main setup function
 */
async function setupHTTPS() {
  console.log('🔒 HTTPS Setup for GameSphere Console Store\n');
  
  // Check if ngrok is installed
  const ngrokInstalled = await checkNgrokInstalled();
  
  if (!ngrokInstalled) {
    console.log('❌ ngrok is not installed.');
    const install = await question('Would you like to install ngrok? (y/n): ');
    
    if (install.toLowerCase() === 'y') {
      try {
        await installNgrok();
      } catch (error) {
        console.log('❌ Failed to install ngrok automatically.');
        console.log('Please install ngrok manually:');
        console.log('1. Visit https://ngrok.com/download');
        console.log('2. Download and install ngrok');
        console.log('3. Run this script again');
        rl.close();
        return;
      }
    } else {
      console.log('Please install ngrok manually and run this script again.');
      rl.close();
      return;
    }
  }

  console.log('\n🚀 Setting up HTTPS tunnel...');
  console.log('\nInstructions:');
  console.log('1. Start your Next.js app: npm run dev');
  console.log('2. In a new terminal, run: ngrok http 3000');
  console.log('3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)');
  
  const httpsUrl = await question('\nEnter your ngrok HTTPS URL: ');
  
  if (!httpsUrl.startsWith('https://')) {
    console.log('❌ Please enter a valid HTTPS URL starting with https://');
    rl.close();
    return;
  }

  // Update environment file
  updateEnvFile(httpsUrl.trim());
  
  // Display OAuth configuration instructions
  displayOAuthInstructions(httpsUrl.trim());
  
  console.log('\n🎉 HTTPS setup complete!');
  console.log('\nNext steps:');
  console.log('1. Configure your OAuth providers using the URLs above');
  console.log('2. Restart your Next.js app: npm run dev');
  console.log('3. Test your HTTPS setup by visiting your ngrok URL');
  
  rl.close();
}

/**
 * Quick ngrok start function
 */
async function startNgrok() {
  console.log('🚀 Starting ngrok tunnel...');
  
  const ngrok = spawn('ngrok', ['http', '3000'], { 
    shell: true,
    stdio: 'inherit'
  });
  
  console.log('\n📋 Instructions:');
  console.log('1. Look for the "Forwarding" line in the ngrok output');
  console.log('2. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)');
  console.log('3. Update your OAuth provider redirect URIs');
  console.log('4. Press Ctrl+C to stop ngrok when done');
}

// Command line interface
const command = process.argv[2];

if (command === 'start') {
  startNgrok();
} else {
  setupHTTPS().catch(error => {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  });
}

module.exports = { setupHTTPS, startNgrok };
