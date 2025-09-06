"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BoardCanvas } from "@/components/BoardCanvas";
import { Toolbar } from "@/components/Toolbar";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const board = useQuery(api.boards.getBoard, { boardId });
  const getOrCreateBoard = useMutation(api.boards.getOrCreateBoard);

  useEffect(() => {
    if (boardId && !board) {
      getOrCreateBoard({ boardId });
    }
  }, [boardId, board, getOrCreateBoard]);

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar 
        boardId={boardId} 
        isDrawingMode={isDrawingMode}
        onDrawingModeChange={setIsDrawingMode}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <BoardCanvas 
        boardId={boardId} 
        isDrawingMode={isDrawingMode}
        selectedColor={selectedColor}
      />
    </div>
  );
}
