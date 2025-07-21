const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testXenditAPI() {
  console.log('🧪 Testing Xendit API Key Permissions...\n');
  
  const secretKey = process.env.XENDIT_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ XENDIT_SECRET_KEY not found in environment variables');
    return;
  }
  
  console.log('🔑 API Key:', secretKey.substring(0, 20) + '...');
  
  // Test 1: Check API key validity with a simple request
  try {
    console.log('\n📋 Test 1: Checking API key validity...');
    
    const response = await fetch('https://api.xendit.co/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API key is valid');
      console.log('💰 Account balance:', result);
    } else {
      console.log('❌ API key validation failed:', result);
    }
  } catch (error) {
    console.error('❌ API key test failed:', error.message);
  }
  
  // Test 2: Try creating a minimal invoice
  try {
    console.log('\n📄 Test 2: Testing invoice creation permissions...');
    
    const testInvoice = {
      external_id: `test-${Date.now()}`,
      amount: 10000,
      description: 'Test Invoice - GameSphere Console Store',
      invoice_duration: 86400,
      currency: 'IDR',
      customer: {
        given_names: 'Test',
        surname: 'User',
        email: 'test@example.com'
      }
    };
    
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testInvoice)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Invoice creation successful!');
      console.log('📄 Invoice ID:', result.id);
      console.log('🔗 Invoice URL:', result.invoice_url);
      
      // Clean up test invoice
      console.log('\n🧹 Cleaning up test invoice...');
      await fetch(`https://api.xendit.co/v2/invoices/${result.id}/expire`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('✅ Test invoice expired');
      
    } else {
      console.log('❌ Invoice creation failed:', result);
      
      if (result.error_code === 'REQUEST_FORBIDDEN_ERROR') {
        console.log('\n🔧 SOLUTION:');
        console.log('1. Go to https://dashboard.xendit.co');
        console.log('2. Navigate to Settings → API Keys');
        console.log('3. Edit your development API key');
        console.log('4. Enable "Invoice Creation" permissions');
        console.log('5. Save changes and try again');
      }
    }
  } catch (error) {
    console.error('❌ Invoice creation test failed:', error.message);
  }
}

testXenditAPI();
