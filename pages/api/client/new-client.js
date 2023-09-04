// /api/client/new-client

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = createRouter()

// use connect based middleware
router.use(cors())

router.post(async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('insuralink')
    const users = db.collection('users')

    const {
      code,
      currentIns,
      currentNumber,
      currentInsEmail,
      yourEmail,
      yourName,
      date,
      idCard,
      eSig,
      newAgentName,
      newAgentCompany,
      newAgentEmail,
      newNumber,
      currentDate,
    } = req.body

    const user = await users.findOneAndUpdate(
      { code },
      {
        $push: {
          clients: {
            currentIns: currentIns[0],
            currentNumber,
            currentInsEmail,
            yourEmail,
            yourName,
            date,
            idCard,
            eSig,
            newAgentName,
            newAgentCompany,
            newAgentEmail,
            newNumber,
            currentDate,
          },
        },
      }
    )

    if (user) {
      //notification to new insurance company
      const msg = {
        to: user.email,
        from: {
          name: 'PolicySwitch',
          email: 'support@policyswitch.co',
        },
        templateId: 'd-5f51b25ff2c9470abbe9c8daa95cdde5',
        dynamic_template_data: {
          name: user.name,
          clientName: yourName,
          currentIns: currentIns[0],
          currentInsEmail,
          yourEmail: yourEmail,
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

      //send request to new insurance company
      const requestMsg = {
        to: currentInsEmail,
        from: {
          name: 'PolicySwitch',
          email: 'support@policyswitch.co',
          replyTo: newAgentEmail,
        },
        templateId: 'd-5a046ff3dbc14de6b898d36895729657',
        dynamic_template_data: {
          currentIns: currentIns[0],
          currentNumber,
          currentInsEmail,
          yourEmail,
          yourName,
          date,
          idCard,
          eSig,
          newAgentName,
          newAgentCompany,
          newAgentEmail,
          newNumber,
          currentDate,
        },
      }

      const requestSendSGMail = async () => {
        try {
          await sgMail.send(requestMsg)
        } catch (error) {
          console.error(error)

          if (error.response) {
            console.error(error.response.body)
          }
        }
      }
      requestSendSGMail()

      //send max customers email if the company hits 90% capacity
      const maxClients =
        user.priceID == process.env.STARTER_PLAN
          ? 100
          : user.priceID == process.env.PRO_PLAN
          ? 500
          : 0
      console.log('max clients >>> ', maxClients)

      if (maxClients > 0 && user.clients.length >= maxClients * 0.9) {
        const maxMsg = {
          to: user.email,
          from: {
            name: 'PolicySwitch',
            email: 'support@policyswitch.co',
          },
          templateId: 'd-65f9c1d33fc848cf9e82297d778f5997',
          dynamic_template_data: {
            name: company.name,
          },
        }

        const maxSendSGMail = async () => {
          try {
            await sgMail.send(maxMsg)
          } catch (error) {
            console.error(error)

            if (error.response) {
              console.error(error.response.body)
            }
          }
        }
        maxSendSGMail()
      }
    }

    console.log(user)
    res.json({ user })
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
