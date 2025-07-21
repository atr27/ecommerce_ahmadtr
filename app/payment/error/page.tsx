'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentErrorPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get error details from URL params
    const paymentIntentStatus = searchParams.get('payment_intent_status')
    const errorMessage = searchParams.get('error_message')
    const errorType = searchParams.get('error_type')

    // Set appropriate error message based on Stripe error
    switch (errorType) {
      case 'card_declined':
        setErrorMessage('Your card was declined. Please try a different payment method.')
        break
      case 'insufficient_funds':
        setErrorMessage('Insufficient funds. Please check your account balance or try a different card.')
        break
      case 'expired_card':
        setErrorMessage('Your card has expired. Please use a different payment method.')
        break
      case 'incorrect_cvc':
        setErrorMessage('The security code (CVC) is incorrect. Please check and try again.')
        break
      case 'processing_error':
        setErrorMessage('A processing error occurred. Please try again.')
        break
      default:
        if (paymentIntentStatus === 'canceled') {
          setErrorMessage('Payment was cancelled. You can try again or use a different payment method.')
        } else {
          setErrorMessage(errorMessage || 'An error occurred during payment processing.')
        }
    }
  }, [searchParams])

  const handleRetryPayment = () => {
    router.push('/checkout')
  }

  const handleBackToCart = () => {
    router.push('/cart')
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-muted-foreground">
            We encountered an issue processing your payment. Don't worry, no charges were made to your account.
          </p>
        </div>

        {/* Error Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-red-600">What happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {errorMessage}
            </p>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Troubleshooting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CreditCard className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Check your payment details</p>
                  <p className="text-sm text-muted-foreground">
                    Ensure your card number, expiry date, and CVV are correct.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">$</span>
                </div>
                <div>
                  <p className="font-medium">Check your account balance</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure you have sufficient funds in your account.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">🏦</span>
                </div>
                <div>
                  <p className="font-medium">Contact your bank</p>
                  <p className="text-sm text-muted-foreground">
                    Your bank might have blocked the transaction for security reasons.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">💳</span>
                </div>
                <div>
                  <p className="font-medium">Try a different payment method</p>
                  <p className="text-sm text-muted-foreground">
                    Use another card or payment option like bank transfer or e-wallet.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleRetryPayment}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={handleBackToCart}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </div>

        {/* Alternative Actions */}
        <div className="text-center mt-8 space-y-4">
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Still having trouble? Here are some alternatives:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm">
                  Contact Support
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  View Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our customer support team is here to help you complete your purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <span className="text-muted-foreground">Email: support@gamesphere.com</span>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-muted-foreground">Phone: +62 21 1234 5678</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
