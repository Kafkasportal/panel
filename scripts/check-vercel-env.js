/**
 * Vercel Environment Variables Kontrol Scripti
 * 
 * Bu script, Vercel'de ayarlı environment variable'ları kontrol eder.
 * 
 * Kullanım:
 *   VERCEL_TOKEN=your_token node scripts/check-vercel-env.js
 */

const PROJECT_ID = 'prj_NVFK9LvEizFBNDxntRkCznPe08pA';
const TEAM_ID = 'team_3iJKMz7mDaPqR5hfw5q7giOT';
const API_URL = 'https://api.vercel.com';

// Gerekli environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
];

async function getEnvVars(apiToken) {
  const url = `${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch env vars: ${response.status} ${error}`);
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
    console.log('  VERCEL_TOKEN=your_token node scripts/check-vercel-env.js');
    process.exit(1);
  }

  console.log('🔍 Vercel Environment Variables Kontrol Ediliyor...\n');

  try {
    const { envs } = await getEnvVars(apiToken);
    
    console.log(`📋 Toplam ${envs.length} environment variable bulundu:\n`);

    const envMap = new Map();
    envs.forEach(env => {
      envMap.set(env.key, env);
    });

    // Gerekli değişkenleri kontrol et
    console.log('✅ Gerekli Environment Variables:\n');
    let allRequiredPresent = true;
    
    REQUIRED_ENV_VARS.forEach(key => {
      const env = envMap.get(key);
      if (env) {
        const targets = env.target || [];
        const value = env.type === 'secret' ? '***' : env.value;
        console.log(`  ✓ ${key}`);
        console.log(`    Value: ${value}`);
        console.log(`    Type: ${env.type}`);
        console.log(`    Targets: ${targets.join(', ')}`);
        console.log('');
      } else {
        console.log(`  ✗ ${key} - EKSİK!`);
        console.log('');
        allRequiredPresent = false;
      }
    });

    // Diğer değişkenleri göster
    const otherEnvs = envs.filter(env => !REQUIRED_ENV_VARS.includes(env.key));
    if (otherEnvs.length > 0) {
      console.log('📦 Diğer Environment Variables:\n');
      otherEnvs.forEach(env => {
        const value = env.type === 'secret' ? '***' : env.value;
        const targets = env.target || [];
        console.log(`  • ${env.key}`);
        console.log(`    Value: ${value}`);
        console.log(`    Type: ${env.type}`);
        console.log(`    Targets: ${targets.join(', ')}`);
        console.log('');
      });
    }

    // Özet
    console.log('─'.repeat(50));
    if (allRequiredPresent) {
      console.log('✅ Tüm gerekli environment variable\'lar ayarlı!');
    } else {
      console.log('❌ Bazı gerekli environment variable\'lar eksik!');
      console.log('\nEksik değişkenleri eklemek için:');
      console.log('1. Vercel Dashboard: https://vercel.com/kafkasder/panel/settings/environment-variables');
      console.log('2. PowerShell Script: $env:VERCEL_TOKEN="your_token"; .\\scripts\\add-vercel-env.ps1');
    }

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getEnvVars, REQUIRED_ENV_VARS };
