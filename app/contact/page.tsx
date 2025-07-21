import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! Get in touch with our friendly support team
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get detailed help via email</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-medium mb-2">support@gamesphere.com</p>
              <p className="text-sm text-muted-foreground">Response within 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Speak directly with our team</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-medium mb-2">1-800-GAMES-01</p>
              <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-8PM EST</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Instant help when you need it</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-medium mb-2">Available Now</p>
              <Button size="sm" className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Inquiry</SelectItem>
                    <SelectItem value="shipping">Shipping Question</SelectItem>
                    <SelectItem value="return">Return/Exchange</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Issue</SelectItem>
                    <SelectItem value="product">Product Question</SelectItem>
                    <SelectItem value="feedback">Feedback/Suggestion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number (If applicable)</Label>
                <Input id="orderNumber" placeholder="GS-12345678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your question or issue in detail..." 
                  rows={6}
                />
              </div>

              <Button className="w-full">Send Message</Button>

              <p className="text-xs text-muted-foreground">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information & FAQ */}
          <div className="space-y-6">
            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Our Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">GameSphere Headquarters</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Gaming Street<br />
                    Tech Valley, CA 94000<br />
                    United States
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-xs text-muted-foreground">
                      Monday - Friday: 9:00 AM - 8:00 PM EST<br />
                      Saturday - Sunday: 10:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Support Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Support:</span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Phone Support:</span>
                  <span className="text-sm font-medium">Mon-Fri 9AM-8PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Live Chat:</span>
                  <span className="text-sm font-medium">Mon-Sun 10AM-10PM EST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time:</span>
                  <span className="text-sm font-medium">Within 24 hours</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Answers</CardTitle>
                <CardDescription>Common questions we receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">How can I track my order?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit your account page or check your email for tracking information.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">What's your return policy?</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day returns on unopened items. See our returns page for details.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Do you ship internationally?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we ship to select countries. Shipping costs vary by location.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">How do I cancel my order?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact us within 1 hour of placing your order for cancellation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
