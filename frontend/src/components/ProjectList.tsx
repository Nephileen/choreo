// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { Folder, Clock, Plus } from "lucide-react";

// interface Project {
//   id: string;
//   name: string;
//   clipCount: number;
//   lastModified: string;
// }

// interface ProjectListProps {
//   onBack: () => void;
//   onCreateNew: () => void;
//   onProjectSelect: (projectId: string) => void;
// }

// // Format like "today", "2 days ago", "1 week ago"
// function formatTimeAgo(iso: string): string {
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return "";

//   const diffMs = Date.now() - d.getTime();
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffDays <= 0) return "today";
//   if (diffDays === 1) return "1 day ago";
//   if (diffDays < 7) return `${diffDays} days ago`;

//   const diffWeeks = Math.floor(diffDays / 7);
//   if (diffWeeks === 1) return "1 week ago";
//   return `${diffWeeks} weeks ago`;
// }

// export function ProjectList({
//   onBack,
//   onCreateNew,
//   onProjectSelect,
// }: ProjectListProps) {
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     const stored = localStorage.getItem("projects");
//     if (!stored) return;
//     try {
//       const parsed = JSON.parse(stored) as Project[];
//       setProjects(parsed);
//     } catch (e) {
//       console.error("Failed to parse localStorage projects", e);
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="container mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <Button
//               variant="ghost"
//               onClick={onBack}
//               className="text-white/70 hover:text-white hover:bg-white/10 mb-2"
//             >
//               ← Back to Home
//             </Button>
//             <h1 className="text-3xl md:text-4xl text-white font-semibold">
//               Your Projects
//             </h1>
//             <p className="text-white/60 text-sm mt-1">
//               Manage and edit your choreography projects
//             </p>
//           </div>

//           <Button
//             onClick={onCreateNew}
//             className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-full flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Create New Project
//           </Button>
//         </div>

//         {/* Empty state */}
//         {projects.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/20 rounded-3xl">
//             <Folder className="w-16 h-16 text-white/30 mb-4" />
//             <p className="text-xl text-white/60 mb-2">No projects yet</p>
//             <p className="text-white/40 mb-6">
//               Create your first choreography project to see it here.
//             </p>
//             <Button
//               onClick={onCreateNew}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
//             >
//               + New Project
//             </Button>
//           </div>
//         ) : (
//           // ⬇️ Centered grid with separate purple cards (like the original)
//           <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-4">
//             {projects.map((project) => (
//               <button
//                 key={project.id}
//                 onClick={() => onProjectSelect(project.id)}
//                 className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.01] transition transform focus:outline-none focus:ring-2 focus:ring-purple-400"
//               >
//                 {/* Top gradient section */}
//                 <div className="h-44 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-700 flex items-center justify-center">
//                   <Folder className="w-10 h-10 text-white/80" />
//                 </div>

//                 {/* Bottom black info section */}
//                 <div className="bg-black px-6 py-4 flex items-center justify-between">
//                   <div>
//                     <h2 className="text-white text-lg font-medium">
//                       {project.name}
//                     </h2>
//                     <p className="text-white/60 text-sm">
//                       {project.clipCount} clip
//                       {project.clipCount === 1 ? "" : "s"}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-1 text-xs text-white/50">
//                     <Clock className="w-3 h-3" />
//                     <span>{formatTimeAgo(project.lastModified)}</span>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


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