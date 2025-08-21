const { StreamClient } = require('@stream-io/node-sdk');
require('dotenv/config');

const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  process.env.STREAM_VIDEO_SECRET_KEY
);

async function forceAgentJoin(meetingId) {
  try {
    console.log('🤖 Forcing AI Agent to join meeting:', meetingId);
    
    // For now, let's use a default agent setup
    // We'll hardcode the agent instructions since we can't import the DB easily
    const agentInstructions = "You are a helpful AI assistant. Engage in natural conversation with the user.";
    const agentId = "ai-agent-" + meetingId;
    
    console.log('✅ Using meeting:', meetingId);
    console.log('✅ Using agent ID:', agentId);
    
    const call = streamVideo.video.call("default", meetingId);
    
    try {
      console.log('🔗 Connecting OpenAI to call...');
      
      const realtimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY,
        agentUserId: agentId,
      });

      console.log('✅ OpenAI client connected successfully!');
      
      await realtimeClient.updateSession({
        instructions: agentInstructions,
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 200
        }
      });
      
      console.log('🎉 SUCCESS! AI Agent is now in the call!');
      console.log('Go back to your meeting - you should now see the agent.');
      
    } catch (error) {
      console.error('❌ Failed to connect OpenAI agent:', error.message);
      console.error('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

const meetingId = process.argv[2];
if (!meetingId) {
  console.log('Usage: node force-agent-join.js <meeting-id>');
  console.log('Example: node force-agent-join.js w59rCypSgR6zH3B4Ep21A');
} else {
  forceAgentJoin(meetingId);
}
