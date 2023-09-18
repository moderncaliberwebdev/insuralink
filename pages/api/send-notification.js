// /api/client

import { createRouter } from 'next-connect'
import cors from 'cors'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = createRouter()

// use connect based middleware
router.use(cors())

router.get(async (req, res) => {
  try {
    const message = {
      from: {
        email: 'support@policyswitch.co',
        name: 'PolicySwitch Support',
      },
      to: 'support@policyswitch.co',
      subject: 'A client did not get their policy cancelled',
      content: [
        {
          type: 'text',
          value: `Client ${req.query.email} did not get their policy cancelled. Reach out to fix it.`,
        },
      ],
    }

    const data = await sgMail.send(message)
    res.json({ data })
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
