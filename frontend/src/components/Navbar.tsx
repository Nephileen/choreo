import { BugIcon, BugOff, BugPlay, BugPlayIcon, ImagePlay, LucideBugPlay, LucidePlay, Play, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onProjectsClick?: () => void;
}

export function Navbar({ onProjectsClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
            <BugIcon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-white text-2xl tracking-tight">Choreo</span>
        </div>

        {/* Projects Button */}
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          onClick={onProjectsClick}
        >
          Projects
        </Button>
      </div>
    </nav>
  );
}