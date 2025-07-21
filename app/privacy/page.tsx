import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. Learn how we protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Secure Data</h3>
                <p className="text-sm text-muted-foreground">
                  Your information is encrypted and stored securely
                </p>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">No Selling</h3>
                <p className="text-sm text-muted-foreground">
                  We never sell your personal data to third parties
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Your Control</h3>
                <p className="text-sm text-muted-foreground">
                  You can update or delete your data anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Account credentials and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Pages visited and time spent on our site</li>
                  <li>Products viewed and purchased</li>
                  <li>Search queries and browsing patterns</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">To Provide Our Services</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and shipping updates</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">To Improve Our Services</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Develop new features and products</li>
                  <li>Conduct research and analytics</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Marketing Communications</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Send promotional emails about new games and offers (with your consent)</li>
                  <li>Personalize content and recommendations</li>
                  <li>Notify you about sales and special events</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Providers</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We share information with trusted third parties who help us operate our business:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Payment processors (Midtrans, Stripe) for secure transactions</li>
                  <li>Shipping companies for order delivery</li>
                  <li>Cloud hosting providers (Vercel, Supabase) for data storage</li>
                  <li>Analytics services to understand site usage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  We may disclose information when required by law, to protect our rights, or to prevent fraud.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Transfers</h3>
                <p className="text-sm text-muted-foreground">
                  In the event of a merger or acquisition, your information may be transferred to the new entity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Protection Measures</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure cloud storage with regular backups</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Regular security audits and updates</li>
                  <li>PCI DSS compliance for payment processing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                  You can request deletion of your account and associated data at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Management</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Update your personal information in your account settings</li>
                  <li>Change your email preferences and communication settings</li>
                  <li>Delete your account and associated data</li>
                  <li>Request a copy of your personal data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Marketing Preferences</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Unsubscribe from promotional emails at any time</li>
                  <li>Opt out of personalized recommendations</li>
                  <li>Control cookie preferences in your browser</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Portability</h3>
                <p className="text-sm text-muted-foreground">
                  You have the right to receive a copy of your personal data in a structured, machine-readable format.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Types of Cookies</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Managing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  You can control cookies through your browser settings. Note that disabling certain cookies may affect site functionality.
                  See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for more details.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. 
                If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you are accessing our services from outside the United States, please note that your information may be transferred to, 
                stored, and processed in the United States where our servers are located. By using our services, you consent to this transfer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page 
                and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@gamesphere.com</p>
                <p><strong>Phone:</strong> 1-800-GAMES-01</p>
                <p><strong>Mail:</strong> GameSphere Privacy Team, 123 Gaming Street, Tech Valley, CA 94000</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
