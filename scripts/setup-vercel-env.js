/**
 * Vercel Environment Variables Setup Script
 * 
 * Bu script, Vercel REST API kullanarak environment variable'ları ekler.
 * Vercel API token'ınızı VERCEL_TOKEN environment variable olarak ayarlayın.
 * 
 * Kullanım:
 *   VERCEL_TOKEN=your_token node scripts/setup-vercel-env.js
 */

const PROJECT_ID = 'prj_NVFK9LvEizFBNDxntRkCznPe08pA';
const TEAM_ID = 'team_3iJKMz7mDaPqR5hfw5q7giOT';
const API_URL = 'https://api.vercel.com';

// Gerekli environment variables
const REQUIRED_ENV_VARS = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase proje URL\'i (örn: https://xxxxx.supabase.co)',
    type: 'plain',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anon/public key',
    type: 'secret',
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    description: 'Uygulama production URL\'i',
    type: 'plain',
    defaultValue: 'https://kafkasder-panel-lemon.vercel.app',
  },
];

// Opsiyonel environment variables
const OPTIONAL_ENV_VARS = [
  {
    key: 'NEXT_PUBLIC_SENTRY_DSN',
    description: 'Sentry DSN (hata takibi için)',
    type: 'plain',
  },
  {
    key: 'SENTRY_AUTH_TOKEN',
    description: 'Sentry auth token',
    type: 'secret',
  },
  {
    key: 'NEXT_PUBLIC_API_URL',
    description: 'Özel API URL\'i',
    type: 'plain',
  },
  {
    key: 'NEXT_PUBLIC_API_TIMEOUT',
    description: 'API timeout süresi (ms)',
    type: 'plain',
  },
  {
    key: 'NEXT_PUBLIC_USE_MOCK_API',
    description: 'Mock API kullanımı (true/false)',
    type: 'plain',
  },
];

async function createEnvVar(apiToken, key, value, type = 'plain', targets = ['production', 'preview', 'development']) {
  const url = `${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value,
      type,
      target: targets,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create ${key}: ${response.status} ${error}`);
  }

  return await response.json();
}

async function main() {
  const apiToken = process.env.VERCEL_TOKEN;
  
  if (!apiToken) {
    console.error('❌ VERCEL_TOKEN environment variable bulunamadı!');
    console.log('\nVercel API token\'ınızı almak için:');
    console.log('1. https://vercel.com/account/tokens adresine gidin');
    console.log('2. Yeni bir token oluşturun');
    console.log('3. Token\'ı VERCEL_TOKEN environment variable olarak ayarlayın');
    console.log('\nKullanım:');
    console.log('  VERCEL_TOKEN=your_token node scripts/setup-vercel-env.js');
    process.exit(1);
  }

  console.log('🚀 Vercel Environment Variables Setup\n');
  console.log('Bu script, environment variable\'ları interaktif olarak eklemenize yardımcı olur.\n');

  // Gerekli değişkenleri göster
  console.log('📋 Gerekli Environment Variables:\n');
  REQUIRED_ENV_VARS.forEach((env, index) => {
    console.log(`${index + 1}. ${env.key}`);
    console.log(`   ${env.description}`);
    if (env.defaultValue) {
      console.log(`   Varsayılan: ${env.defaultValue}`);
    }
    console.log('');
  });

  console.log('⚠️  Not: Bu script, değerleri doğrudan eklemek için kullanılamaz.');
  console.log('   Değerleri güvenli bir şekilde eklemek için Vercel Dashboard\'u kullanın:\n');
  console.log('   https://vercel.com/kafkasder/kafkasder-panel/settings/environment-variables\n');
  console.log('   Veya Vercel CLI kullanın:\n');
  console.log('   vercel env add <KEY> production preview development\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createEnvVar, REQUIRED_ENV_VARS, OPTIONAL_ENV_VARS };
