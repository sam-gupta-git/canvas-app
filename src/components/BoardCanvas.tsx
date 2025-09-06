"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { StickyNote } from "./StickyNote";
import { DrawingCanvas } from "./DrawingCanvas";
import { useState } from "react";

interface BoardCanvasProps {
  boardId: string;
  isDrawingMode?: boolean;
  selectedColor?: string;
}

export function BoardCanvas({ boardId, isDrawingMode = false, selectedColor = "#000000" }: BoardCanvasProps) {
  const notes = useQuery(api.boards.getNotes, { boardId });
  const drawings = useQuery(api.boards.getDrawings, { boardId });
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  if (!notes || !drawings) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Drawing Canvas - Background layer */}
        <DrawingCanvas 
          boardId={boardId} 
          drawings={drawings} 
          isDrawingMode={isDrawingMode}
          selectedColor={selectedColor}
        />
        
        {/* Sticky Notes - Foreground layer */}
        <div className="absolute inset-0 pointer-events-none">
          {notes.map((note) => (
            <div key={note._id} className="pointer-events-auto">
              <StickyNote note={note} />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
