const API = 'http://localhost:5000/api';
let authToken = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(symbol, message, color = colors.reset) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function test(name, fn) {
  try {
    await fn();
    log('✅', name, colors.green);
    return true;
  } catch (error) {
    log('❌', `${name}: ${error.message}`, colors.red);
    return false;
  }
}

async function runTests() {
  console.log('\n' + colors.blue + '═══════════════════════════════════════════');
  console.log('   REGRESSION TESTING SUITE');
  console.log('   Srigandha Admin CMS');
  console.log('═══════════════════════════════════════════' + colors.reset + '\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Login
  const loginResult = await test('1. Admin Login', async () => {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@srigandha.org',
        password: 'admin@123'
      })
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    if (!data.token) throw new Error('No token received');

    authToken = data.token;
    console.log(`   📝 User: ${data.username} (${data.role})`);
  });
  loginResult ? passed++ : failed++;

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test 2: Get Profile
  const profileResult = await test('2. Get User Profile', async () => {
    const response = await fetch(`${API}/auth/profile`, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   👤 Username: ${data.username}`);
  });
  profileResult ? passed++ : failed++;

  // Test 3: Get Events
  const eventsResult = await test('3. Get All Events', async () => {
    const response = await fetch(`${API}/events`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   📅 Found: ${data.length} events`);
  });
  eventsResult ? passed++ : failed++;

  // Test 4: Get Pages
  const pagesResult = await test('4. Get All Pages', async () => {
    const response = await fetch(`${API}/pages`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   📄 Found: ${data.length} pages`);
  });
  pagesResult ? passed++ : failed++;

  // Test 5: Get Committee
  const committeeResult = await test('5. Get Committee Members', async () => {
    const response = await fetch(`${API}/committee`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   👥 Found: ${data.length} members`);
  });
  committeeResult ? passed++ : failed++;

  // Test 6: Get Gallery
  const galleryResult = await test('6. Get Gallery', async () => {
    const response = await fetch(`${API}/gallery`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   🖼️  Found: ${data.length} galleries`);
  });
  galleryResult ? passed++ : failed++;

  // Test 7: Get Contact Messages
  const contactResult = await test('7. Get Contact Messages', async () => {
    const response = await fetch(`${API}/contact`, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   📧 Found: ${data.length} messages`);
  });
  contactResult ? passed++ : failed++;

  // Test 8: Get Settings
  const settingsResult = await test('8. Get Site Settings', async () => {
    const response = await fetch(`${API}/settings`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`   ⚙️  Site: ${data.siteName || 'N/A'}`);
  });
  settingsResult ? passed++ : failed++;

  // Test 9: Error Handling - Invalid ID
  const errorTest1 = await test('9. Error Handling - Invalid ID', async () => {
    const response = await fetch(`${API}/events/invalid-id-123`);
    if (response.status !== 400) throw new Error('Should return 400');
    const data = await response.json();
    if (!data.message.includes('Invalid ID')) throw new Error('Wrong error message');
    console.log(`   ✓ Returns 400 with proper message`);
  });
  errorTest1 ? passed++ : failed++;

  // Test 10: Create Event Validation
  const validationTest = await test('10. Validation - Missing Required Fields', async () => {
    const response = await fetch(`${API}/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title: 'Test' }) // Missing required fields
    });
    if (response.status !== 400) throw new Error('Should return 400');
    const data = await response.json();
    if (!data.message.includes('required fields')) throw new Error('Wrong error message');
    console.log(`   ✓ Returns 400 with validation message`);
  });
  validationTest ? passed++ : failed++;

  // Summary
  console.log('\n' + colors.blue + '═══════════════════════════════════════════');
  console.log('   TEST RESULTS');
  console.log('═══════════════════════════════════════════' + colors.reset);
  console.log(colors.green + `   ✅ Passed: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(colors.red + `   ❌ Failed: ${failed}${colors.reset}`);
  }
  console.log(colors.blue + '═══════════════════════════════════════════' + colors.reset + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error(colors.red + '\n❌ Test suite error:', error.message + colors.reset);
  process.exit(1);
});
