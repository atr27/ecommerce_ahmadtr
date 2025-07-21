import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Truck } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Scale className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Fair Use</h3>
                <p className="text-sm text-muted-foreground">
                  Use our services responsibly and legally
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  We protect your rights as a customer
                </p>
              </div>
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Limitations</h3>
                <p className="text-sm text-muted-foreground">
                  Understanding service boundaries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                By accessing and using GameSphere's website and services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-sm text-muted-foreground">
                These terms apply to all visitors, users, and others who access or use our service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GameSphere is an online marketplace for console video games and gaming accessories. We provide:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Online catalog of video games for various gaming platforms</li>
                <li>Secure payment processing and order management</li>
                <li>Customer support and order tracking</li>
                <li>User account management and order history</li>
                <li>Product reviews and recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Creation</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 13 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Keep your contact information up to date</li>
                  <li>Do not share your account with others</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                4. Orders and Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Order Process</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Order confirmation does not guarantee product availability</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Payment is due at the time of order placement</li>
                  <li>We accept major credit cards and approved payment methods</li>
                  <li>All payments are processed securely through our payment partners</li>
                  <li>You authorize us to charge your payment method for all purchases</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing and Taxes</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>All prices are listed in USD unless otherwise specified</li>
                  <li>Applicable taxes will be added to your order total</li>
                  <li>Shipping costs are calculated at checkout</li>
                  <li>We reserve the right to correct pricing errors</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                5. Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Shipping Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We ship to addresses within our supported regions</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                  <li>You are responsible for providing accurate shipping information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Issues</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Contact us within 7 days of expected delivery for missing packages</li>
                  <li>We are not responsible for delays caused by shipping carriers</li>
                  <li>Additional charges may apply for failed delivery attempts</li>
                  <li>International shipments may be subject to customs delays</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Return Policy</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Items must be returned within 30 days of delivery</li>
                  <li>Products must be in original, unopened condition</li>
                  <li>Original packaging and all accessories must be included</li>
                  <li>Digital products and opened software cannot be returned</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refund Process</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Refunds are processed to the original payment method</li>
                  <li>Processing time is 3-5 business days after we receive the return</li>
                  <li>Shipping costs are non-refundable unless the return is due to our error</li>
                  <li>Restocking fees may apply to certain items</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">You may not use our service:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations or laws</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track the personal information of others</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Our Content</h3>
                <p className="text-sm text-muted-foreground">
                  The service and its original content, features, and functionality are and will remain the exclusive property of GameSphere and its licensors. 
                  The service is protected by copyright, trademark, and other laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">User Content</h3>
                <p className="text-sm text-muted-foreground">
                  By posting content on our service (such as reviews), you grant us a non-exclusive, worldwide, royalty-free license to use, 
                  modify, publicly perform, publicly display, reproduce, and distribute such content.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Disclaimers and Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Disclaimers</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Our service is provided "as is" without any representations or warranties</li>
                  <li>We do not warrant that the service will be uninterrupted or error-free</li>
                  <li>We are not responsible for the content, accuracy, or opinions expressed in user reviews</li>
                  <li>Product descriptions and images are for informational purposes only</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  In no event shall GameSphere be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                If you wish to terminate your account, you may simply discontinue using the service or contact us to delete your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, 
                without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved 
                in the courts of California.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. 
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@gamesphere.com</p>
                <p><strong>Phone:</strong> 1-800-GAMES-01</p>
                <p><strong>Mail:</strong> GameSphere Legal Team, 123 Gaming Street, Tech Valley, CA 94000</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
