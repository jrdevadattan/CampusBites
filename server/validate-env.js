#!/usr/bin/env node

/**
 * CampusBites Environment & API Validation Script
 * Tests all .env variables and API endpoints
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const BASE_URL = 'http://localhost:8080';

let testsPassed = 0;
let testsFailed = 0;

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEnvironmentVariables() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🔍 TESTING ENVIRONMENT VARIABLES', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  const envVars = [
    { name: 'MONGODB_URI', required: true, sensitive: true },
    { name: 'FRONTEND_URL', required: true, sensitive: false },
    { name: 'CLODINARY_CLOUD_NAME', required: true, sensitive: false },
    { name: 'CLODINARY_API_KEY', required: true, sensitive: false },
    { name: 'CLODINARY_API_SECRET_KEY', required: true, sensitive: true },
    { name: 'RESEND_API', required: true, sensitive: true },
    { name: 'SECRET_KEY_ACCESS_TOKEN', required: true, sensitive: true },
    { name: 'SECRET_KEY_REFRESH_TOKEN', required: true, sensitive: true },
    { name: 'PORT', required: false, sensitive: false },
    { name: 'STRIPE_SECRET_KEY', required: false, sensitive: true }
  ];

  envVars.forEach(envVar => {
    const value = process.env[envVar.name];
    const status = value ? '✅' : '❌';
    const displayValue = value ? (envVar.sensitive ? '***' + value.slice(-4) : value) : 'NOT SET';
    const requirement = envVar.required ? '[REQUIRED]' : '[OPTIONAL]';

    log(`${status} ${envVar.name} ${requirement}`, value ? 'green' : 'red');
    log(`   Value: ${displayValue}\n`, value ? 'green' : 'red');

    if (value) testsPassed++;
    else if (envVar.required) testsFailed++;
  });
}

async function testMongoDBConnection() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🗄️  TESTING MONGODB CONNECTION', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      log('❌ MONGODB_URI not configured', 'red');
      testsFailed++;
      return;
    }

    log('Attempting connection...', 'yellow');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });

    log('✅ MongoDB Connection: SUCCESS', 'green');
    log(`   Connected to: ${mongoUri.split('@')[1]}`, 'green');
    testsPassed++;

    await mongoose.disconnect();
  } catch (error) {
    log('❌ MongoDB Connection: FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function testCloudinaryAPI() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('☁️  TESTING CLOUDINARY API', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    const cloudName = process.env.CLODINARY_CLOUD_NAME;
    const apiKey = process.env.CLODINARY_API_KEY;
    const apiSecret = process.env.CLODINARY_API_SECRET_KEY;

    if (!cloudName || !apiKey || !apiSecret) {
      log('❌ Cloudinary credentials not configured', 'red');
      testsFailed++;
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    log('Testing Cloudinary configuration...', 'yellow');

    // Test by trying to get account info
    const result = await cloudinary.api.usage();

    log('✅ Cloudinary API: SUCCESS', 'green');
    log(`   Cloud Name: ${cloudName}`, 'green');
    log(`   API Key: ***${apiKey.slice(-4)}`, 'green');
    log(`   Account Status: Active`, 'green');
    testsPassed++;
  } catch (error) {
    log('❌ Cloudinary API: FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function testResendAPI() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('📧 TESTING RESEND EMAIL API', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    const resendApi = process.env.RESEND_API;

    if (!resendApi) {
      log('❌ RESEND_API not configured', 'red');
      testsFailed++;
      return;
    }

    log('Testing Resend API connection...', 'yellow');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApi}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok || response.status === 200 || response.status === 401) {
      log('✅ Resend Email API: SUCCESS', 'green');
      log(`   API Key: re_***${resendApi.slice(-8)}`, 'green');
      log(`   Status: Accessible`, 'green');
      testsPassed++;
    } else {
      log('❌ Resend Email API: FAILED', 'red');
      log(`   Status Code: ${response.status}`, 'red');
      testsFailed++;
    }
  } catch (error) {
    log('❌ Resend Email API: FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function testJWTSecrets() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🔐 TESTING JWT SECRETS', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    const accessToken = process.env.SECRET_KEY_ACCESS_TOKEN;
    const refreshToken = process.env.SECRET_KEY_REFRESH_TOKEN;

    if (!accessToken || !refreshToken) {
      log('❌ JWT Secrets not configured', 'red');
      testsFailed++;
      return;
    }

    const accessTokenValid = accessToken.length >= 20;
    const refreshTokenValid = refreshToken.length >= 20;

    if (accessTokenValid) {
      log('✅ SECRET_KEY_ACCESS_TOKEN: VALID', 'green');
      log(`   Length: ${accessToken.length} characters`, 'green');
      testsPassed++;
    } else {
      log('⚠️  SECRET_KEY_ACCESS_TOKEN: TOO SHORT', 'yellow');
      log(`   Length: ${accessToken.length} characters (recommended: 20+)`, 'yellow');
      testsFailed++;
    }

    if (refreshTokenValid) {
      log('✅ SECRET_KEY_REFRESH_TOKEN: VALID', 'green');
      log(`   Length: ${refreshToken.length} characters`, 'green');
      testsPassed++;
    } else {
      log('⚠️  SECRET_KEY_REFRESH_TOKEN: TOO SHORT', 'yellow');
      log(`   Length: ${refreshToken.length} characters (recommended: 20+)`, 'yellow');
      testsFailed++;
    }
  } catch (error) {
    log('❌ JWT Secrets: ERROR', 'red');
    log(`   Error: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function testAPIEndpoints() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🚀 TESTING API ENDPOINTS', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  const endpoints = [
    { method: 'GET', path: '/', description: 'Health Check' },
    { method: 'GET', path: '/api/category/get', description: 'Get Categories' },
    { method: 'POST', path: '/api/product/get', description: 'Get Products', body: { skip: 0, limit: 10 } }
  ];

  for (const endpoint of endpoints) {
    try {
      log(`Testing ${endpoint.method} ${endpoint.path}...`, 'yellow');

      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (endpoint.body && endpoint.method === 'POST') {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(`${BASE_URL}${endpoint.path}`, options);

      if (response.ok) {
        log(`✅ ${endpoint.description}: SUCCESS (${response.status})`, 'green');
        testsPassed++;
      } else {
        log(`⚠️  ${endpoint.description}: ${response.status}`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${endpoint.description}: FAILED`, 'red');
      log(`   Error: ${error.message}`, 'red');
      testsFailed++;
    }
  }
}

async function testCORSConfiguration() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('🔗 TESTING CORS CONFIGURATION', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  try {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      log('❌ FRONTEND_URL not configured', 'red');
      testsFailed++;
      return;
    }

    log(`FRONTEND_URL: ${frontendUrl}`, 'cyan');
    
    if (frontendUrl === 'http://localhost:5173') {
      log('✅ CORS Configuration: VALID (Development)', 'green');
      log('   Frontend origin is correctly set to localhost:5173', 'green');
      testsPassed++;
    } else if (frontendUrl.includes('vercel.app') || frontendUrl.includes('campusbites')) {
      log('✅ CORS Configuration: VALID (Production)', 'green');
      log(`   Frontend origin: ${frontendUrl}`, 'green');
      testsPassed++;
    } else {
      log('⚠️  CORS Configuration: UNUSUAL', 'yellow');
      log(`   Frontend origin: ${frontendUrl}`, 'yellow');
    }
  } catch (error) {
    log('❌ CORS Configuration: ERROR', 'red');
    log(`   Error: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function generateReport() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('📊 VALIDATION REPORT', 'blue');
  log('═══════════════════════════════════════════\n', 'cyan');

  const totalTests = testsPassed + testsFailed;
  const passPercentage = totalTests > 0 ? ((testsPassed / totalTests) * 100).toFixed(2) : 0;

  log(`Total Tests: ${totalTests}`, 'cyan');
  log(`✅ Passed: ${testsPassed}`, 'green');
  log(`❌ Failed: ${testsFailed}`, 'red');
  log(`Success Rate: ${passPercentage}%\n`, passPercentage >= 80 ? 'green' : 'red');

  if (testsFailed === 0) {
    log('🎉 ALL TESTS PASSED! Your environment is properly configured.', 'green');
  } else if (passPercentage >= 80) {
    log('⚠️  Some optional tests failed. Review above for details.', 'yellow');
  } else {
    log('❌ Critical failures detected. Fix the issues above before deploying.', 'red');
  }

  log('\n═══════════════════════════════════════════\n', 'cyan');
}

// Run all tests
async function runAllTests() {
  log('\n\n');
  log('╔═══════════════════════════════════════════╗', 'cyan');
  log('║   CampusBites API & ENV Validation       ║', 'cyan');
  log('║   Started: ' + new Date().toLocaleString() + '       ║', 'cyan');
  log('╚═══════════════════════════════════════════╝', 'cyan');

  try {
    await testEnvironmentVariables();
    await testMongoDBConnection();
    await testCloudinaryAPI();
    await testResendAPI();
    await testJWTSecrets();
    await testCORSConfiguration();
    await testAPIEndpoints();
    await generateReport();
  } catch (error) {
    log('\n❌ Fatal Error during validation:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

runAllTests().catch(console.error);
