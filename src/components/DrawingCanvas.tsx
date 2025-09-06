"use client";

import { useRef, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import dynamic from "next/dynamic";

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), {
  ssr: false,
});
const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), {
  ssr: false,
});
const Line = dynamic(() => import("react-konva").then((mod) => mod.Line), {
  ssr: false,
});

interface DrawingCanvasProps {
  boardId: string;
  drawings: Array<{
    _id: string;
    points: Array<{ x: number; y: number }>;
    color: string;
    strokeWidth: number;
  }>;
  isDrawingMode?: boolean;
  selectedColor?: string;
}

export function DrawingCanvas({ boardId, drawings, isDrawingMode = false, selectedColor = "#000000" }: DrawingCanvasProps) {
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  
  const addDrawing = useMutation(api.boards.addDrawing);

  const handleMouseDown = (e: any) => {
    if (!isDrawingMode) return;
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    setCurrentPath([{ x: pos.x, y: pos.y }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setCurrentPath([...currentPath, { x: point.x, y: point.y }]);
  };

  const handleMouseUp = async () => {
    if (!isDrawing || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    // Save the drawing to the backend
    await addDrawing({
      boardId,
      points: currentPath,
      color: selectedColor,
      strokeWidth: 2,
    });

    setIsDrawing(false);
    setCurrentPath([]);
  };

  return (
    <div className="absolute inset-0">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 60} // Account for toolbar height
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        className={isDrawingMode ? "cursor-crosshair" : "cursor-default"}
      >
        <Layer>
          {/* Render existing drawings */}
          {drawings.map((drawing) => (
            <Line
              key={drawing._id}
              points={drawing.points.flatMap(p => [p.x, p.y])}
              stroke={drawing.color}
              strokeWidth={drawing.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          
          {/* Render current drawing path */}
          {currentPath.length > 1 && (
            <Line
              points={currentPath.flatMap(p => [p.x, p.y])}
              stroke={selectedColor}
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
