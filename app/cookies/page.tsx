import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, BarChart, Target, Shield, Info } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground">
            Learn how we use cookies to improve your experience
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Functionality</h3>
                <p className="text-sm text-muted-foreground">
                  Remember your preferences and settings
                </p>
              </div>
              <div className="text-center">
                <BarChart className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Help us understand how you use our site
                </p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Personalization</h3>
                <p className="text-sm text-muted-foreground">
                  Provide relevant content and recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Categories */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Essential Cookies
                <Badge variant="secondary">Always Active</Badge>
              </CardTitle>
              <CardDescription>
                These cookies are necessary for the website to function and cannot be switched off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What they do:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Enable basic website functionality</li>
                    <li>Remember items in your shopping cart</li>
                    <li>Keep you logged in during your session</li>
                    <li>Ensure secure connections and prevent fraud</li>
                    <li>Remember your cookie preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>session_id:</strong> Maintains your login session</p>
                      <p><strong>cart_items:</strong> Remembers your shopping cart</p>
                    </div>
                    <div>
                      <p><strong>csrf_token:</strong> Protects against security threats</p>
                      <p><strong>cookie_consent:</strong> Remembers your cookie choices</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                Performance Cookies
                <Badge variant="outline">Optional</Badge>
              </CardTitle>
              <CardDescription>
                These cookies help us understand how visitors interact with our website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What they do:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Count visits and traffic sources</li>
                    <li>Measure how you use the website</li>
                    <li>Help us improve site performance</li>
                    <li>Identify popular content and features</li>
                    <li>Track conversion rates and user journeys</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Third-party services:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Google Analytics:</strong> Website usage statistics</p>
                      <p><strong>Vercel Analytics:</strong> Performance monitoring</p>
                    </div>
                    <div>
                      <p><strong>Hotjar:</strong> User behavior analysis</p>
                      <p><strong>Mixpanel:</strong> Event tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Functional Cookies
                <Badge variant="outline">Optional</Badge>
              </CardTitle>
              <CardDescription>
                These cookies enable enhanced functionality and personalization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What they do:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Remember your language and region preferences</li>
                    <li>Save your display settings (dark/light mode)</li>
                    <li>Remember your recently viewed products</li>
                    <li>Provide personalized content recommendations</li>
                    <li>Enable social media sharing features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>theme_preference:</strong> Dark/light mode setting</p>
                      <p><strong>language:</strong> Your preferred language</p>
                    </div>
                    <div>
                      <p><strong>recently_viewed:</strong> Products you've looked at</p>
                      <p><strong>wishlist:</strong> Your saved items</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Marketing Cookies
                <Badge variant="outline">Optional</Badge>
              </CardTitle>
              <CardDescription>
                These cookies are used to deliver relevant advertisements and track campaign effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What they do:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Show you relevant ads based on your interests</li>
                    <li>Limit the number of times you see an ad</li>
                    <li>Measure the effectiveness of advertising campaigns</li>
                    <li>Track conversions from ads to purchases</li>
                    <li>Enable retargeting and lookalike audiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Advertising partners:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Google Ads:</strong> Search and display advertising</p>
                      <p><strong>Facebook Pixel:</strong> Social media advertising</p>
                    </div>
                    <div>
                      <p><strong>Microsoft Advertising:</strong> Bing search ads</p>
                      <p><strong>Reddit Pixel:</strong> Reddit advertising</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Managing Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Cookie Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can control which cookies we use by adjusting your preferences below:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Essential Cookies</h4>
                      <p className="text-sm text-muted-foreground">Required for basic functionality</p>
                    </div>
                    <Badge variant="secondary">Always On</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Performance Cookies</h4>
                      <p className="text-sm text-muted-foreground">Help us improve our website</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Functional Cookies</h4>
                      <p className="text-sm text-muted-foreground">Enhanced features and personalization</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">Relevant ads and marketing</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Browser Settings</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You can also control cookies through your browser settings:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies</p>
                    <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</p>
                  </div>
                  <div>
                    <p><strong>Safari:</strong> Preferences → Privacy → Cookies</p>
                    <p><strong>Edge:</strong> Settings → Cookies and site permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
            <CardDescription>
              Some cookies are set by third-party services that appear on our pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Payment Processors</h4>
                <p className="text-sm text-muted-foreground">
                  Midtrans and other payment providers may set cookies to process transactions securely and prevent fraud.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Social Media</h4>
                <p className="text-sm text-muted-foreground">
                  Social media platforms may set cookies when you interact with their embedded content or sharing buttons.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analytics Services</h4>
                <p className="text-sm text-muted-foreground">
                  Third-party analytics services help us understand how our website is used and how we can improve it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact of Disabling Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Impact of Disabling Cookies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              While you can disable cookies, doing so may affect your experience on our website:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Potential Issues</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Shopping cart may not work properly</li>
                  <li>You may need to log in repeatedly</li>
                  <li>Preferences won't be remembered</li>
                  <li>Some features may not function</li>
                  <li>Less personalized experience</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-600">What Still Works</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Browsing products and content</li>
                  <li>Reading product information</li>
                  <li>Contacting customer support</li>
                  <li>Accessing help and legal pages</li>
                  <li>Basic website navigation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this cookie policy from time to time to reflect changes in our practices or for legal reasons. 
                We'll notify you of any significant changes by posting the updated policy on this page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> privacy@gamesphere.com</p>
                <p><strong>Phone:</strong> 1-800-GAMES-01</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
