import { Inngest } from "inngest";

// create a client to send or receive events
export const inngest = new Inngest({
  id: "finance", // Unique app ID
  name: "Finance ",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
