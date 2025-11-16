import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Save, Upload, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";

interface VideoClip {
  id: string;
  name: string;
  duration: number;
  url: string;
  notes?: string;
}

interface TimelineClip {
  id: string;
  clipId: string;
  startTime: number;
  duration: number;
  trackIndex: number;
}

interface AdvancedEditorProps {
  projectId: string;
  onBack: () => void;
}

// Mock data - in real app this would come from props or API
const mockClips: VideoClip[] = [
  { id: "1", name: "Intro Move.mp4", duration: 15, url: "" },
  { id: "2", name: "Main Routine.mp4", duration: 30, url: "" },
  { id: "3", name: "Spin Section.mp4", duration: 12, url: "" },
  { id: "4", name: "Floor Work.mp4", duration: 20, url: "" },
  { id: "5", name: "Finale.mp4", duration: 18, url: "" },
];

export function AdvancedEditor({ projectId, onBack }: AdvancedEditorProps) {
  const [clips, setClips] = useState<VideoClip[]>(mockClips);
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([
    { id: "t1", clipId: "1", startTime: 0, duration: 15, trackIndex: 0 },
    { id: "t2", clipId: "2", startTime: 15, duration: 30, trackIndex: 0 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [draggedClip, setDraggedClip] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;

  const newClips: VideoClip[] = Array.from(files).map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    duration: 0,
    url: URL.createObjectURL(file),
    notes: "",
  }));

  setClips((prev) => [...prev, ...newClips]);

  // reset input so you can import the same file again later if needed
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

const handleImportClick = () => {
  fileInputRef.current?.click();
};

  /* */

  const pixelsPerSecond = 10;
  const totalDuration = Math.max(
    ...timelineClips.map((tc) => tc.startTime + tc.duration),
    60
  );

  const handleDragStart = (clipId: string) => {
    setDraggedClip(clipId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, trackIndex: number) => {
    e.preventDefault();
    if (!draggedClip) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const startTime = Math.max(0, Math.floor(x / pixelsPerSecond));

    const clip = clips.find((c) => c.id === draggedClip);
    if (!clip) return;

    const newTimelineClip: TimelineClip = {
      id: `t${Date.now()}`,
      clipId: draggedClip,
      startTime,
      duration: clip.duration,
      trackIndex,
    };

    setTimelineClips((prev) => [...prev, newTimelineClip]);
    setDraggedClip(null);
  };

  const handleTimelineClipDragStart = (e: React.DragEvent, timelineClipId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("timelineClipId", timelineClipId);
  };

  const handleTimelineClipDrop = (e: React.DragEvent, trackIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const timelineClipId = e.dataTransfer.getData("timelineClipId");
    if (!timelineClipId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newStartTime = Math.max(0, Math.floor(x / pixelsPerSecond));

    setTimelineClips((prev) =>
      prev.map((tc) =>
        tc.id === timelineClipId
          ? { ...tc, startTime: newStartTime, trackIndex }
          : tc
      )
    );
  };

  const removeTimelineClip = (timelineClipId: string) => {
    setTimelineClips((prev) => prev.filter((tc) => tc.id !== timelineClipId));
  };

  const getClipById = (clipId: string) => {
    return clips.find((c) => c.id === clipId);
  };

  return (
    <div className="h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      <input
  ref={fileInputRef}
  type="file"
  accept="video/*"
  multiple
  onChange={handleImportFileSelect}
  title="Import video files"
  aria-label="Import video files"
  className="hidden"
/>
      {/* Top Toolbar */}
      <div className="bg-[#2a2a2a] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            ← Projects
          </Button>
          <div className="h-6 w-px bg-white/20"></div>
          <h2 className="text-white">Project Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleImportClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mr-2">
            Import
          </Button>

          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Clips Library */}
        <div className="w-80 bg-[#202020] border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white">Clips</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {clips.map((clip) => (
              <Card
                key={clip.id}
                draggable
                onDragStart={() => handleDragStart(clip.id)}
                className="bg-[#2a2a2a] border-white/10 p-3 cursor-move hover:bg-[#333] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{clip.name}</p>
                    <p className="text-white/50 text-xs">{clip.duration}s</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Center - Preview and Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Preview Monitor */}
          <div className="h-[45%] bg-black border-b border-white/10 flex items-center justify-center">
            <div className="w-full max-w-3xl aspect-video bg-[#0a0a0a] rounded-lg flex items-center justify-center">
              <Play className="w-16 h-16 text-white/30" />
            </div>
          </div>

          {/* Timeline Area */}
          <div className="flex-1 flex flex-col bg-[#252525]">
            {/* Playback Controls */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-white/70 text-sm font-mono">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Timeline Ruler */}
            <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
              <div className="relative h-6" style={{ width: totalDuration * pixelsPerSecond }}>
                {Array.from({ length: Math.ceil(totalDuration / 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 text-xs text-white/50"
                    style={{ left: i * 5 * pixelsPerSecond }}
                  >
                    {i * 5}s
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-auto">
              <div className="px-4 py-4">
                {[0, 1, 2].map((trackIndex) => (
                  <div
                    key={trackIndex}
                    className="relative h-16 mb-2 bg-[#1a1a1a] rounded border border-white/10"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      const timelineClipId = e.dataTransfer.getData("timelineClipId");
                      if (timelineClipId) {
                        handleTimelineClipDrop(e, trackIndex);
                      } else {
                        handleDrop(e, trackIndex);
                      }
                    }}
                    style={{ width: totalDuration * pixelsPerSecond }}
                  >
                    {/* Track Label */}
                    <div className="absolute -left-12 top-0 h-full flex items-center">
                      <span className="text-white/50 text-sm">V{trackIndex + 1}</span>
                    </div>

                    {/* Timeline Clips */}
                    {timelineClips
                      .filter((tc) => tc.trackIndex === trackIndex)
                      .map((tc) => {
                        const clip = getClipById(tc.clipId);
                        return (
                          <div
                            key={tc.id}
                            draggable
                            onDragStart={(e) => handleTimelineClipDragStart(e, tc.id)}
                            className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-between px-2 group cursor-move"
                            style={{
                              left: tc.startTime * pixelsPerSecond,
                              width: tc.duration * pixelsPerSecond,
                            }}
                          >
                            <span className="text-white text-xs truncate flex-1">
                              {clip?.name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e: { stopPropagation: () => void; }) => {
                                e.stopPropagation();
                                removeTimelineClip(tc.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-black/30"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-[#202020] border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white">Properties</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Volume</label>
              <Slider defaultValue={[50]} max={100} step={1} className="b-full" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Speed</label>
              <Slider defaultValue={[100]} max={200} min={25} step={5} className="w-full"/>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Opacity</label>
              <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
