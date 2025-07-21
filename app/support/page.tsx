import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Truck, RotateCcw } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help you with any questions or issues you may have
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Contact Us</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Track Order</CardTitle>
                <CardDescription>Check your order status</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/returns">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Returns</CardTitle>
                <CardDescription>Return or exchange items</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/shipping">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Shipping Info</CardTitle>
                <CardDescription>Delivery and shipping details</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How long does shipping take?</h3>
              <p className="text-muted-foreground">
                Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my order?</h3>
              <p className="text-muted-foreground">
                You can cancel your order within 1 hour of placing it. After that, please contact our support team.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and various digital payment methods through our secure payment gateway.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Are the games region-locked?</h3>
              <p className="text-muted-foreground">
                Most games are region-free, but some may have regional restrictions. Check the product description for specific details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer digital downloads?</h3>
              <p className="text-muted-foreground">
                Currently, we focus on physical game copies. Digital codes may be available for select titles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with us directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@gamesphere.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">1-800-GAMES-01</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-8PM EST</p>
                  <p className="text-sm text-muted-foreground">Sat-Sun: 10AM-6PM EST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Contact Form</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What can we help you with?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue or question..." rows={4} />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
