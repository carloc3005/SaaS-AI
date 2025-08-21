const { StreamClient } = require('@stream-io/node-sdk');
require('dotenv/config');

const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  process.env.STREAM_VIDEO_SECRET_KEY
);

async function disconnectAllAgents(meetingId) {
  try {
    console.log('🔌 Disconnecting all agents from meeting:', meetingId);
    
    const call = streamVideo.video.call('default', meetingId);
    const callState = await call.get();
    
    console.log('📊 Current participants:', callState.call.session?.participants?.length || 0);
    
    if (callState.call.session?.participants) {
      console.log('👥 Participants:');
      callState.call.session.participants.forEach(p => {
        console.log(`  - ${p.user?.id} (${p.user?.name || 'No name'}) - Role: ${p.role}`);
      });
      
      // Try to end the call to disconnect all participants
      console.log('🔚 Ending call to disconnect all participants...');
      await call.endCall();
      console.log('✅ Call ended successfully');
    } else {
      console.log('ℹ️ No active session found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

const meetingId = process.argv[2];
if (!meetingId) {
  console.log('Usage: node disconnect-all-agents.js <meeting-id>');
  console.log('Example: node disconnect-all-agents.js eHsqP5MvSQO1eAttvqLWE');
} else {
  disconnectAllAgents(meetingId);
}
