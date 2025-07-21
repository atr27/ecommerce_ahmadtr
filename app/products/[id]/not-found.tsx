import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto bg-white/5 border-purple-500/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
              <p className="text-gray-400">
                The product you're looking for doesn't exist or has been removed.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Browse All Products
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
