// /api/webhooks

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../utils/db'
import { buffer } from 'micro'
import { Stripe } from 'stripe'
import { log } from 'console'
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)

const router = createRouter()

// use connect based middleware
router.use(cors())

router.post(async (req, res) => {
  const signature = req.headers['stripe-signature']
  const buf = await buffer(req)

  const event = stripe.webhooks.constructEvent(
    buf,
    signature,
    process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
  )

  // Handle the event
  switch (event.type) {
    // case 'customer.subscription.updated': {
    //   const subscription = event.data.object
    //   console.log(subscription)
    //   break
    // }
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object
      const sessionId = checkoutSession.id
      const email = checkoutSession.metadata.uid
      const customer = checkoutSession.customer
      const subscription = checkoutSession.subscription

      const subscriptionData = await stripe.subscriptions.retrieve(subscription)

      const paymentMethod = subscriptionData.default_payment_method
      const productId = subscriptionData.plan.product

      // console.log(checkoutSession)
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log(invoice)
      break
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
})
// this will run if none of the above matches
router.all((req, res) => {
  res.status(405).json({
    error: 'Method not allowed',
  })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default router.handler({
  onError(err, req, res) {
    res.status(500).json({
      error: err.message,
    })
  },
})
