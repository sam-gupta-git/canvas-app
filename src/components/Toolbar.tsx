"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { StickyNote, Palette, Eraser } from "lucide-react";

interface ToolbarProps {
  boardId: string;
  isDrawingMode: boolean;
  onDrawingModeChange: (mode: boolean) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function Toolbar({ 
  boardId, 
  isDrawingMode, 
  onDrawingModeChange, 
  selectedColor, 
  onColorChange 
}: ToolbarProps) {
  const addNote = useMutation(api.boards.addNote);

  const noteColors = [
    { name: "yellow", class: "bg-yellow-200 border-yellow-300" },
    { name: "pink", class: "bg-pink-200 border-pink-300" },
    { name: "blue", class: "bg-blue-200 border-blue-300" },
    { name: "green", class: "bg-green-200 border-green-300" },
    { name: "purple", class: "bg-purple-200 border-purple-300" },
  ];

  const drawingColors = [
    { name: "black", value: "#000000" },
    { name: "red", value: "#ef4444" },
    { name: "blue", value: "#3b82f6" },
    { name: "green", value: "#10b981" },
    { name: "purple", value: "#8b5cf6" },
    { name: "orange", value: "#f97316" },
  ];

  const handleAddNote = async () => {
    const x = Math.random() * (window.innerWidth - 300) + 50;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    
    await addNote({
      boardId,
      text: "",
      x,
      y,
      color: "yellow", // Default note color
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Canvas Board</h1>
        <div className="text-sm text-gray-500">
          Board ID: <span className="font-mono">{boardId}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Drawing Color Picker */}
        {isDrawingMode && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Draw Color:</span>
            <div className="flex gap-1">
              {drawingColors.map((color) => (
                <button
                  key={color.name}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color.value
                      ? "ring-2 ring-gray-400"
                      : "hover:scale-110"
                  } transition-transform`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onColorChange(color.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Note Button */}
        <Button
          onClick={handleAddNote}
          className="flex items-center gap-2"
          disabled={isDrawingMode}
        >
          <StickyNote className="h-4 w-4" />
          Add Note
        </Button>

        {/* Drawing Mode Toggle */}
        <Button
          variant={isDrawingMode ? "default" : "outline"}
          onClick={() => onDrawingModeChange(!isDrawingMode)}
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
          {isDrawingMode ? "Exit Draw" : "Draw"}
        </Button>
      </div>
    </div>
  );
}
