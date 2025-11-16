import { Plus, Folder, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Project {
  id: string;
  name: string;
  clipCount: number;
  lastModified: string;
  thumbnail?: string;
}

interface ProjectListProps {
  onCreateNew: () => void;
  onProjectSelect: (projectId: string) => void;
  onBack: () => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Summer Dance Routine",
    clipCount: 8,
    lastModified: "2 days ago",
  },
  {
    id: "2",
    name: "Hip Hop Freestyle",
    clipCount: 12,
    lastModified: "1 week ago",
  },
  {
    id: "3",
    name: "Contemporary Piece",
    clipCount: 6,
    lastModified: "2 weeks ago",
  },
  {
    id: "4",
    name: "Ballet Performance",
    clipCount: 10,
    lastModified: "3 weeks ago",
  },
];

export function ProjectList({ onCreateNew, onProjectSelect, onBack }: ProjectListProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-4"
          >
            ← Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-white">Your Projects</h1>
              <p className="text-white mt-2">
                Manage and edit your choreography projects
              </p>
            </div>
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              onClick={() => onProjectSelect(project.id)}
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                <Folder className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-colors" />
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <h3 className="text-xl text-white">{project.name}</h3>
                <div className="flex items-center justify-between text-sm text-white/50">
                  <span>{project.clipCount} clips</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.lastModified}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}