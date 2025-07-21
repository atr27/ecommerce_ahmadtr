import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6">
        {/* Simple centered layout */}
        <div className="flex flex-col items-center space-y-4">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="gaming-gradient rounded-lg p-2">
              <span className="text-lg font-bold text-white">GS</span>
            </div>
            <span className="text-xl font-bold">GameSphere</span>
          </div>
          
          {/* Description */}
          <p className="text-center text-sm text-muted-foreground max-w-md">
            Your ultimate destination for console games. Discover, play, and enjoy the best gaming experience.
          </p>
          
          {/* Copyright */}
          <div className="pt-4 border-t border-border/50 w-full">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 GameSphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
