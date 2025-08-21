require('dotenv/config');

console.log('🔍 Environment Check');
console.log('===================');

const requiredEnvVars = [
  'NEXT_PUBLIC_STREAM_VIDEO_API_KEY',
  'STREAM_VIDEO_SECRET_KEY',
  'OPENAI_API_KEY',
  'DATABASE_URL'
];

let allGood = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: MISSING`);
    allGood = false;
  }
});

console.log('\n📋 Summary:');
if (allGood) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log('❌ Some environment variables are missing. Check your .env file.');
}
