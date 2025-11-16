import { Navbar } from "./components/Navbar";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Sparkles, Video, Scissors } from "lucide-react";
import { Button } from "./components/ui/button";
import { ProjectEditor } from "./components/ProjectEditor";
import { ProjectList } from "./components/ProjectList";
import { AdvancedEditor } from "./components/AdvancedEditor";
import { useState } from "react";

type Page = "home" | "projectList" | "uploadEditor" | "advancedEditor";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // When user clicks a project in "Your Projects"
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("advancedEditor");
  };

  // ⬇️ When a brand-new project is saved from ProjectEditor
  const handleNewProjectSaved = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("advancedEditor"); // go straight to the editor
  };

  // Render based on current page
  if (currentPage === "uploadEditor") {
    return (
      <ProjectEditor
        onBack={() => setCurrentPage("home")}
        onSave={handleNewProjectSaved}   // ⬅️ pass onSave
      />
    );
  }

  if (currentPage === "projectList") {
    return (
      <ProjectList
        onBack={() => setCurrentPage("home")}
        onCreateNew={() => setCurrentPage("uploadEditor")}
        onProjectSelect={handleProjectSelect}
      />
    );
  }

  if (currentPage === "advancedEditor" && selectedProjectId) {
    return (
      <AdvancedEditor
        projectId={selectedProjectId}
        onBack={() => setCurrentPage("projectList")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Dancing Images */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1589460562162-847ebc689d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGNob3Jlb2dyYXBoeXxlbnwxfHx8fDE3NjMyMzU5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Dance choreography"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1686172249094-8d0e7eeb6bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYW5jZSUyMG1vdmVtZW50fGVufDF8fHx8MTc2MzIwNDA2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern dance movement"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1495791185843-c73f2269f669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsZXQlMjBkYW5jZXJ8ZW58MXx8fHwxNzYzMjE1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Ballet dancer"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>

      {/* Navbar */}
      <Navbar onProjectsClick={() => setCurrentPage("projectList")} />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">
                Create. Combine. Choreograph.
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl text-white tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Choreography
              </span>
              <br />
              Made Simple
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Piece together stunning dance videos from small
              choreography clips. Create, edit, and perfect your
              routines with ease.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => setCurrentPage("uploadEditor")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50"
            >
              Start Creating
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
            >
              View Examples
            </Button> */}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl text-white">
                Clip & Combine
              </h3>
              <p className="text-white/60">
                Break down your choreography into manageable
                pieces and seamlessly combine them.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl text-white">
                Video Editor
              </h3>
              <p className="text-white/60">
                Professional editing tools designed specifically
                for dance and choreography.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl text-white">
                Polish & Perfect
              </h3>
              <p className="text-white/60">
                Fine-tune transitions, timing, and effects to
                create stunning final products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}