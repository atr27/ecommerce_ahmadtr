import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Package, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-muted-foreground">
            Easy returns and exchanges for your peace of mind
          </p>
        </div>

        {/* Return Policy Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Our Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">30-Day Window</h3>
                <p className="text-sm text-muted-foreground">
                  Return items within 30 days of delivery for a full refund
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Original Condition</h3>
                <p className="text-sm text-muted-foreground">
                  Items must be unopened and in original packaging
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Free Returns</h3>
                <p className="text-sm text-muted-foreground">
                  We provide prepaid return labels for your convenience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return an Item</CardTitle>
            <CardDescription>Follow these simple steps to return your purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Initiate Return</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to your <Link href="/orders" className="text-primary hover:underline">order history</Link> and select the item you want to return. Click "Request Return" and select your reason.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Print Return Label</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll email you a prepaid return shipping label. Print it out and attach it to your package.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Package & Ship</h3>
                  <p className="text-sm text-muted-foreground">
                    Pack the item in its original packaging (if available) and drop it off at any authorized shipping location.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Your Refund</h3>
                  <p className="text-sm text-muted-foreground">
                    Once we receive and process your return, we'll issue a refund to your original payment method within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span className="text-sm">Unopened games in original packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span className="text-sm">Defective or damaged items</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span className="text-sm">Wrong item shipped</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span className="text-sm">Accessories in original condition</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
                <span className="text-sm">Pre-orders (before release date)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-600">✗</Badge>
                <span className="text-sm">Opened games (unless defective)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-600">✗</Badge>
                <span className="text-sm">Digital download codes (once redeemed)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-600">✗</Badge>
                <span className="text-sm">Items returned after 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-600">✗</Badge>
                <span className="text-sm">Damaged packaging due to misuse</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600 border-red-600">✗</Badge>
                <span className="text-sm">Items without original packaging</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exchanges</CardTitle>
            <CardDescription>Need a different version or platform?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                We offer exchanges for the same item in a different platform (e.g., PS5 to Xbox) or edition, 
                subject to availability and price differences.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Exchange Process:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Initiate a return for the original item</li>
                  <li>Place a new order for the desired item</li>
                  <li>We'll process both transactions simultaneously</li>
                  <li>Pay any price difference or receive a refund</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Need to Return Something?</CardTitle>
              <CardDescription>Start your return process now</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/orders">
                <Button className="w-full">View My Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions About Returns?</CardTitle>
              <CardDescription>Our support team is here to help</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
