import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="gaming-gradient rounded-lg p-2">
                <span className="text-lg font-bold text-white">GS</span>
              </div>
              <span className="text-lg font-bold">GameSphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for console games. Discover, play, and enjoy the best gaming experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Games
              </Link>
              <Link href="/products?category=PS5" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                PlayStation
              </Link>
              <Link href="/products?category=Xbox" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Xbox
              </Link>
              <Link href="/products?category=Nintendo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Nintendo
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 GameSphere. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Next.js</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-medium">Supabase</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-medium">Midtrans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
