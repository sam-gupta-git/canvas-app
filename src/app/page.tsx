"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StickyNote, Users, Zap } from "lucide-react";

export default function Home() {
  const [boardId, setBoardId] = useState("");
  const router = useRouter();

  const handleCreateBoard = () => {
    // Generate a more user-friendly board ID
    const adjectives = ["happy", "bright", "creative", "smart", "bold", "quick", "wise", "cool"];
    const nouns = ["board", "canvas", "space", "room", "zone", "area", "place", "spot"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    const newBoardId = `${adjective}-${noun}-${number}`;
    router.push(`/board/${newBoardId}`);
  };

  const handleJoinBoard = () => {
    if (boardId.trim()) {
      router.push(`/board/${boardId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Canvas App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Real-time collaborative board for sticky notes and drawings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StickyNote className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sticky Notes</h3>
            <p className="text-gray-600">
              Add, edit, and move sticky notes with drag-and-drop. Choose from multiple colors.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Sync</h3>
            <p className="text-gray-600">
              See changes instantly across all connected users. No login required.
            </p>
          </Card>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Get Started
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={handleCreateBoard}
                className="w-full h-12 text-lg"
                size="lg"
              >
                Create New Board
              </Button>
              
              <div className="text-center text-gray-500">or</div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Enter Board ID"
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJoinBoard();
                    }
                  }}
                />
                <Button
                  onClick={handleJoinBoard}
                  variant="outline"
                  className="w-full"
                  disabled={!boardId.trim()}
                >
                  Join Existing Board
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Share the board URL with others to collaborate in real-time</p>
        </div>
      </div>
    </div>
  );
}
