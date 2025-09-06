import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Clean up boards that haven't been accessed in 24 hours
crons.daily(
  "cleanup old boards",
  { hourUTC: 2, minuteUTC: 0 }, // Run at 2 AM UTC daily
  api.boards.cleanupOldBoards,
  { olderThan: Date.now() - 24 * 60 * 60 * 1000 }
);

export default crons;
