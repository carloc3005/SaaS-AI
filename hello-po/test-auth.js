// Simple test script to verify authentication is working
// Run this in browser console after making changes

console.log('Testing authentication flow...');

// Test 1: Check if we can access the auth client
if (typeof window !== 'undefined') {
    console.log('✓ Running in browser environment');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
} else {
    console.log('✗ Not running in browser');
}

// Test 2: Check cookies
const cookies = document.cookie;
console.log('Current cookies:', cookies);

// Test 3: Check if we're on the right page
if (window.location.pathname === '/sign-in') {
    console.log('✓ On sign-in page');
} else if (window.location.pathname === '/') {
    console.log('✓ On home page');
} else {
    console.log('? On other page:', window.location.pathname);
}

// Test 4: If there are auth-related cookies, show them
const authCookies = cookies.split(';').filter(cookie => 
    cookie.includes('better-auth') || 
    cookie.includes('session') || 
    cookie.includes('token')
);

if (authCookies.length > 0) {
    console.log('✓ Found auth-related cookies:', authCookies);
} else {
    console.log('✗ No auth-related cookies found');
}

console.log('Test complete. Check the console output above.');
