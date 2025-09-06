import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    id: v.string(),
    createdAt: v.number(),
    lastAccessedAt: v.number(),
  }).index("by_board_id", ["id"]),
  
  notes: defineTable({
    boardId: v.string(),
    text: v.string(),
    x: v.number(),
    y: v.number(),
    color: v.string(),
    createdAt: v.number(),
  }).index("by_board", ["boardId"]),
  
  drawings: defineTable({
    boardId: v.string(),
    points: v.array(v.object({
      x: v.number(),
      y: v.number(),
    })),
    color: v.string(),
    strokeWidth: v.number(),
    createdAt: v.number(),
  }).index("by_board", ["boardId"]),
});
