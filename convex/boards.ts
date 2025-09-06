import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a board
export const getOrCreateBoard = mutation({
  args: { boardId: v.string() },
  handler: async (ctx, { boardId }) => {
    const existingBoard = await ctx.db
      .query("boards")
      .withIndex("by_board_id", (q) => q.eq("id", boardId))
      .first();

    if (existingBoard) {
      // Update last accessed time
      await ctx.db.patch(existingBoard._id, {
        lastAccessedAt: Date.now(),
      });
      return existingBoard;
    }

    // Create new board
    const now = Date.now();
    const newBoardId = await ctx.db.insert("boards", {
      id: boardId,
      createdAt: now,
      lastAccessedAt: now,
    });
    
    return { _id: newBoardId, id: boardId, createdAt: now, lastAccessedAt: now };
  },
});

// Get board data
export const getBoard = query({
  args: { boardId: v.string() },
  handler: async (ctx, { boardId }) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_board_id", (q) => q.eq("id", boardId))
      .first();
  },
});

// Get all notes for a board
export const getNotes = query({
  args: { boardId: v.string() },
  handler: async (ctx, { boardId }) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();
  },
});

// Get all drawings for a board
export const getDrawings = query({
  args: { boardId: v.string() },
  handler: async (ctx, { boardId }) => {
    return await ctx.db
      .query("drawings")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .collect();
  },
});

// Add a note
export const addNote = mutation({
  args: {
    boardId: v.string(),
    text: v.string(),
    x: v.number(),
    y: v.number(),
    color: v.string(),
  },
  handler: async (ctx, { boardId, text, x, y, color }) => {
    return await ctx.db.insert("notes", {
      boardId,
      text,
      x,
      y,
      color,
      createdAt: Date.now(),
    });
  },
});

// Update a note
export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    text: v.optional(v.string()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { noteId, text, x, y, color }) => {
    const updates: any = {};
    if (text !== undefined) updates.text = text;
    if (x !== undefined) updates.x = x;
    if (y !== undefined) updates.y = y;
    if (color !== undefined) updates.color = color;
    
    return await ctx.db.patch(noteId, updates);
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, { noteId }) => {
    return await ctx.db.delete(noteId);
  },
});

// Add a drawing stroke
export const addDrawing = mutation({
  args: {
    boardId: v.string(),
    points: v.array(v.object({
      x: v.number(),
      y: v.number(),
    })),
    color: v.string(),
    strokeWidth: v.number(),
  },
  handler: async (ctx, { boardId, points, color, strokeWidth }) => {
    return await ctx.db.insert("drawings", {
      boardId,
      points,
      color,
      strokeWidth,
      createdAt: Date.now(),
    });
  },
});

// Delete a drawing stroke
export const deleteDrawing = mutation({
  args: { drawingId: v.id("drawings") },
  handler: async (ctx, { drawingId }) => {
    return await ctx.db.delete(drawingId);
  },
});

// Clean up old boards (for auto-expiry)
export const cleanupOldBoards = mutation({
  args: { olderThan: v.number() },
  handler: async (ctx, { olderThan }) => {
    const oldBoards = await ctx.db
      .query("boards")
      .filter((q) => q.lt(q.field("lastAccessedAt"), olderThan))
      .collect();

    for (const board of oldBoards) {
      // Delete all notes and drawings for this board
      const notes = await ctx.db
        .query("notes")
        .withIndex("by_board", (q) => q.eq("boardId", board.id))
        .collect();
      
      const drawings = await ctx.db
        .query("drawings")
        .withIndex("by_board", (q) => q.eq("boardId", board.id))
        .collect();

      for (const note of notes) {
        await ctx.db.delete(note._id);
      }
      
      for (const drawing of drawings) {
        await ctx.db.delete(drawing._id);
      }

      // Delete the board
      await ctx.db.delete(board._id);
    }

    return oldBoards.length;
  },
});
