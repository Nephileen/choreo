import { useState, useRef } from "react";
import { Upload, X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface VideoClip {
  id: string;
  file: File;
  url: string;
  notes: string;
}

interface ProjectEditorProps {
  onBack: () => void;
}

export function ProjectEditor({ onBack }: ProjectEditorProps) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newClips: VideoClip[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      notes: "",
    }));

    setClips((prev) => [...prev, ...newClips]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setClips((prev) =>
      prev.map((clip) => (clip.id === id ? { ...clip, notes } : clip))
    );
  };

  const handleRemoveClip = (id: string) => {
    setClips((prev) => {
      const clip = prev.find((c) => c.id === id);
      if (clip) {
        URL.revokeObjectURL(clip.url);
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              onClick={onBack}
              
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-4xl text-white">New Project</h1>
            <p className="text-white mt-2">
              Upload your choreography clips and add notes to each one
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Save Project
          </Button>
        </div>

        {/* Upload Button */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            title="Upload video files"
            aria-label="Upload video files"
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            size="lg"
            // variant="outline"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Video Clips
          </Button>
        </div>

        {/* Video Grid */}
        {clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/20 rounded-2xl">
            <Upload className="w-16 h-16 text-white/30 mb-4" />
            <p className="text-xl text-white mb-2">No clips yet</p>
            <p className="text-white mb-6">
              Upload your first video clip to get started
            </p>
            <Button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Upload Videos
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => (
              <Card
                key={clip.id}
                className="bg-white/5 border-white/10 overflow-hidden"
              >
                <div className="relative aspect-video bg-black">
                  <video
                    src={clip.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveClip(clip.id)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <label className="block text-sm text-white/70 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={clip.notes}
                    onChange={(e) => handleNotesChange(clip.id, e.target.value)}
                    placeholder="Add notes about this clip..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                    rows={3}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
