// Simple debugging script to test agent functionality
// Run this in your local environment to test agent joining

async function testAgentJoin() {
    try {
        console.log('🧪 Testing agent join functionality...');
        
        // Replace with an actual meeting ID from your database
        const meetingId = 'your-meeting-id-here';
        
        const response = await fetch('https://illustrious-moonbeam-62b25d.netlify.app/api/force-agent-join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meetingId }),
        });
        
        const result = await response.json();
        console.log('📋 Response status:', response.status);
        console.log('📋 Response data:', result);
        
    } catch (error) {
        console.error('❌ Error testing agent join:', error);
    }
}

// Uncomment and run with a real meeting ID
// testAgentJoin();

console.log('ℹ️ To test agent joining:');
console.log('1. Create a meeting in your app');
console.log('2. Replace "your-meeting-id-here" with the actual meeting ID');
console.log('3. Uncomment the testAgentJoin() call');
console.log('4. Run: node debug-agent.js');
