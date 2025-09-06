"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface StickyNoteProps {
  note: {
    _id: string;
    text: string;
    x: number;
    y: number;
    color: string;
  };
}

const colors = [
  { name: "yellow", class: "bg-yellow-200 border-yellow-300" },
  { name: "pink", class: "bg-pink-200 border-pink-300" },
  { name: "blue", class: "bg-blue-200 border-blue-300" },
  { name: "green", class: "bg-green-200 border-green-300" },
  { name: "purple", class: "bg-purple-200 border-purple-300" },
];

export function StickyNote({ note }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const updateNote = useMutation(api.boards.updateNote);
  const deleteNote = useMutation(api.boards.deleteNote);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: note._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleTextBlur = async () => {
    if (text !== note.text) {
      await updateNote({
        noteId: note._id as any,
        text: text,
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setText(note.text); // Reset to original text
      setIsEditing(false);
    }
  };

  const handleColorChange = async (color: string) => {
    await updateNote({
      noteId: note._id as any,
      color: color,
    });
    setShowColorPicker(false);
  };

  const handleDelete = async () => {
    await deleteNote({ noteId: note._id as any });
  };

  const currentColor = colors.find(c => c.name === note.color) || colors[0];

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        left: note.x,
        top: note.y,
        zIndex: isDragging ? 1000 : 1,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`w-64 h-48 p-4 cursor-move hover:shadow-lg transition-shadow ${
          currentColor.class
        } ${isDragging ? "shadow-xl" : ""}`}
        {...attributes}
        {...listeners}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="h-6 w-6 p-0"
            >
              <Palette className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {showColorPicker && (
          <div className="absolute top-12 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-6 h-6 rounded-full border-2 ${
                    color.class
                  } ${
                    note.color === color.name
                      ? "ring-2 ring-gray-400"
                      : "hover:scale-110"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(color.name);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {isEditing ? (
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleTextBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTextBlur();
              } else {
                handleKeyDown(e);
              }
            }}
            className="w-full h-32 resize-none border-none bg-transparent focus:ring-0 p-0"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="w-full h-32 cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {text || "Click to add text..."}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
