import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package, Shield, Zap } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl text-muted-foreground">
            Fast, reliable delivery for your gaming needs
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-primary" />
                <CardTitle>Standard Shipping</CardTitle>
              </div>
              <CardDescription>Reliable delivery at an affordable price</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Delivery Time:</span>
                  <Badge variant="secondary">3-5 Business Days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost:</span>
                  <span className="font-medium">$5.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Free Shipping:</span>
                  <span className="font-medium">Orders over $50</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Perfect for most orders. Your games will be carefully packaged and delivered safely.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                <CardTitle>Express Shipping</CardTitle>
              </div>
              <CardDescription>Get your games faster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Delivery Time:</span>
                  <Badge variant="default">1-2 Business Days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost:</span>
                  <span className="font-medium">$12.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Free Express:</span>
                  <span className="font-medium">Orders over $100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  For when you can't wait to start playing. Priority handling and faster delivery.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              How We Ship Your Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Order Confirmed</h3>
                <p className="text-sm text-muted-foreground">
                  Your order is confirmed and payment processed
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Carefully Packed</h3>
                <p className="text-sm text-muted-foreground">
                  Games are securely packaged to prevent damage
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Shipped Out</h3>
                <p className="text-sm text-muted-foreground">
                  Your package is handed to our shipping partners
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Delivered</h3>
                <p className="text-sm text-muted-foreground">
                  Your games arrive safely at your doorstep
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Zones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Zones & Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Domestic (USA)</h3>
                  <p className="text-sm text-muted-foreground">All 50 states</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">3-5 business days</p>
                  <p className="text-sm text-muted-foreground">Standard shipping</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Canada</h3>
                  <p className="text-sm text-muted-foreground">Major cities</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">5-7 business days</p>
                  <p className="text-sm text-muted-foreground">International rates apply</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">International</h3>
                  <p className="text-sm text-muted-foreground">Select countries</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">7-14 business days</p>
                  <p className="text-sm text-muted-foreground">Customs may apply</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Order Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                <strong>Processing Time:</strong> 1-2 business days
              </p>
              <p className="text-sm">
                <strong>Cut-off Time:</strong> Orders placed before 2 PM EST ship same day
              </p>
              <p className="text-sm">
                <strong>Weekend Orders:</strong> Processed on the next business day
              </p>
              <p className="text-sm">
                <strong>Holiday Processing:</strong> May experience delays during peak seasons
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Package Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                <strong>Secure Packaging:</strong> Bubble wrap and protective materials
              </p>
              <p className="text-sm">
                <strong>Insurance:</strong> All packages insured up to $100
              </p>
              <p className="text-sm">
                <strong>Tracking:</strong> Full tracking information provided
              </p>
              <p className="text-sm">
                <strong>Signature Required:</strong> For orders over $200
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
