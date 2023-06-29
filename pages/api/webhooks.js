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

    //set info in database after a checkout session is completed
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object
      const email = checkoutSession.metadata.uid
      const customerID = checkoutSession.customer
      const subscriptionID = checkoutSession.subscription
      const subscriptionData = await stripe.subscriptions.retrieve(
        subscriptionID
      )

      const paymentMethod = subscriptionData.default_payment_method
      const productID = subscriptionData.plan.product
      const priceID = subscriptionData.plan.id

      try {
        const client = await clientPromise
        const db = client.db('insuralink')
        const users = db.collection('users')

        const user = await users.updateOne(
          { email },
          {
            $set: {
              subscribed: true,
              subscriptionID,
              customerID,
              productID,
              paymentMethod,
              priceID,
            },
          }
        )
        res.json({ user })
      } catch (e) {
        console.error(e)
      }
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
