// /api/webhooks

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../utils/db'
import { buffer } from 'micro'
import { Stripe } from 'stripe'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    //set info in database after a checkout session is completed
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object
      const email = checkoutSession.metadata.uid
      const customerID = checkoutSession.customer
      const subscriptionID = checkoutSession.subscription

      const subscriptionData = await stripe.subscriptions.retrieve(
        subscriptionID
      )
      const customer = await stripe.customers.update(customerID, {
        metadata: {
          uid: email,
        },
      })

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
    //webhook if payment fails
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log(invoice)
      break
    }
    //webhook for when a subscription is deleted
    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerID = subscription.customer

      const customer = await stripe.customers.retrieve(customerID)

      try {
        const client = await clientPromise
        const db = client.db('insuralink')
        const users = db.collection('users')

        const user = await users.findOneAndUpdate(
          { email: customer.metadata.uid },
          {
            $set: {
              subscribed: false,
              subscriptionID: '',
              productID: '',
              priceID: '',
            },
          }
        )

        if (user) {
          //cancellation email
          const todaysDate = new Date()

          const msg = {
            to: user.value.email,
            from: {
              name: 'PolicySwitch',
              email: 'support@policyswitch.co',
            },
            templateId: 'd-cbcf447ee54c4ef48ee116f8219394dd',
            dynamic_template_data: {
              name: user.value.name,
              date: `${todaysDate.toLocaleString('en-US', {
                month: 'long',
              })} ${todaysDate.getDate()}, ${todaysDate.getFullYear()} `,
            },
          }
          //ES8
          const sendSGMail = async () => {
            try {
              await sgMail.send(msg)
            } catch (error) {
              console.error(error)

              if (error.response) {
                console.error(error.response.body)
              }
            }
          }
          sendSGMail()
        }

        res.json({ user })
      } catch (e) {
        console.error(e)
      }

      console.log(subscription)
      break
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
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
