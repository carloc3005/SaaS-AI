import { db } from "../src/db";
import { meetings, user, agents } from "../src/db/schema";
import { nanoid } from "nanoid";

// Sample meeting summary to test the improved formatting
const sampleSummary = `### Overview
This was a productive quarterly planning meeting where the development team discussed the roadmap for Q1 2025. The team covered key priorities including the new user dashboard redesign, API performance improvements, and the implementation of real-time collaboration features. Important decisions were made regarding resource allocation and timeline adjustments to ensure deliverable quality.

The meeting also addressed critical feedback from the recent user testing sessions, particularly around the mobile experience and onboarding flow. Several action items were assigned to team members with specific deadlines to maintain project momentum.

### Notes

#### Key Decisions Made
- Approved the new dashboard design with simplified navigation
- Decided to prioritize API performance optimization over new features
- Agreed to extend the mobile app deadline by two weeks for quality assurance
- Selected React Query for state management in the new components

#### Action Items & Next Steps
- Sarah to complete user research analysis by Friday, January 10th
- Mike to start API performance audit next Monday
- Design team to prepare high-fidelity mockups by January 15th
- Schedule follow-up meeting for January 20th to review progress

#### Technical Implementation Details
- Database migration required for new user preference schema
- Integration with third-party analytics service needs security review
- Performance monitoring dashboard to be implemented using Grafana
- API rate limiting to be increased from 100 to 500 requests per minute

#### User Feedback & Concerns
- 73% of users found the current onboarding process confusing
- Mobile users reported slow loading times on older devices
- Request for dark mode theme was mentioned by multiple participants
- Accessibility improvements needed for screen reader compatibility

#### Budget & Resources
- Additional $15,000 approved for performance optimization tools
- Two temporary contractors to be hired for mobile development
- Design system audit scheduled for February with external consultant
- Server infrastructure upgrade planned for March 2025`;

async function createSampleMeetings() {
  try {
    console.log("Creating sample meetings with improved summaries...");

    // Check if we have any users and agents
    const existingUsers = await db.select().from(user).limit(1);
    const existingAgents = await db.select().from(agents).limit(1);

    if (existingUsers.length === 0) {
      console.log("No users found. Please create a user account first.");
      return;
    }

    if (existingAgents.length === 0) {
      console.log("No agents found. Please create an agent first.");
      return;
    }

    const sampleUserId = existingUsers[0].id;
    const sampleAgentId = existingAgents[0].id;

    // Create a completed meeting with a rich summary
    const completedMeeting = await db
      .insert(meetings)
      .values({
        id: nanoid(),
        name: "Q1 2025 Planning Meeting",
        userId: sampleUserId,
        agentId: sampleAgentId,
        status: "completed",
        isPrivate: false,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        summary: sampleSummary,
        transcriptUrl: null,
        recordingUrl: null,
      })
      .returning();

    // Create a processing meeting (without summary)
    const processingMeeting = await db
      .insert(meetings)
      .values({
        id: nanoid(),
        name: "Weekly Team Standup",
        userId: sampleUserId,
        agentId: sampleAgentId,
        status: "processing",
        isPrivate: false,
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        endedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        transcriptUrl: null,
        recordingUrl: null,
      })
      .returning();

    console.log("✅ Sample meetings created successfully!");
    console.log(`Completed meeting ID: ${completedMeeting[0].id}`);
    console.log(`Processing meeting ID: ${processingMeeting[0].id}`);
    console.log("\nYou can now test the improved key notes and highlighting features!");

  } catch (error) {
    console.error("❌ Error creating sample meetings:", error);
  }
}

// Run the script
createSampleMeetings().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});