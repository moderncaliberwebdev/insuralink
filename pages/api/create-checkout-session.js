// /api/create-checkout-session

import { createRouter } from 'next-connect'
import cors from 'cors'
import { Stripe } from 'stripe'
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)

const router = createRouter()

// use connect based middleware
router.use(cors())

router.post(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: req.body.price,
          quantity: 1,
        },
      ],
      metadata: {
        uid: req.body.uid.email,
      },
      mode: 'subscription',
      success_url: `${process.env.YOUR_DOMAIN}/company-portal`,
      cancel_url: `${process.env.YOUR_DOMAIN}/company-portal/plans`,
    })

    console.log(session)

    res.json({ url: session.url })
  } catch (e) {
    console.error(e)
  }
})
// this will run if none of the above matches
router.all((req, res) => {
  res.status(405).json({
    error: 'Method not allowed',
  })
})

export default router.handler({
  onError(err, req, res) {
    res.status(500).json({
      error: err.message,
    })
  },
})
