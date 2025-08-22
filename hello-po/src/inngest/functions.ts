import { agents, meetings, user } from "@/db/schema";
import { db } from "@/db";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/ui/views/types";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarizer = createAgent({
  name: "summarizer",
  system: `
  You are an expert meeting summarizer. Create a clear, comprehensive summary of the meeting.

  Write a well-structured summary in 3-4 paragraphs covering:
  1. Overview of what was discussed
  2. Key decisions and outcomes  
  3. Action items and next steps
  4. Important highlights or concerns

  Write in a professional, easy-to-read style. Use complete sentences and natural language. 
  Do not use markdown formatting, bullet points, or headers - just flowing paragraph text.
`.trim(),
model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
})

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    })

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speaker", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          })));

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          })));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " + JSON.stringify(transcriptWithSpeakers)
    )

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed"
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
  },
);