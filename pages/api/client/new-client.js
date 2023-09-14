// /api/client/new-client

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db'
import sgMail from '@sendgrid/mail'
import sendgridClient from '@sendgrid/client'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sendgridClient.setApiKey(process.env.SENDGRID_API_KEY)

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    secretAccessKey: process.env.AWS_SECURE_SECRET_KEY,
    accessKeyId: process.env.AWS_SECURE_ACCESS_KEY_ID,
  },
  signatureVersion: 'v4',
})

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
        to: user.value.email,
        from: {
          name: 'PolicySwitch',
          email: 'support@policyswitch.co',
        },
        templateId: 'd-5f51b25ff2c9470abbe9c8daa95cdde5',
        dynamic_template_data: {
          name: user.value.name,
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

          //remove id card from S3 for security
          const bucketParams = {
            Bucket: 'insuralink',
            Key: idCard.split('amazonaws.com/')[1],
          }

          try {
            const data = await s3.send(new DeleteObjectCommand(bucketParams))
            console.log('Success. Object deleted.', data)
            return data // For unit tests.
          } catch (err) {
            console.log('Error', err)
          }
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
        user.value.priceID == process.env.NEXT_PUBLIC_STARTER_PLAN
          ? 100
          : user.value.priceID == process.env.NEXT_PUBLIC_PRO_PLAN
          ? 500
          : 0

      if (maxClients > 0 && user.value.clients.length >= maxClients * 0.9) {
        const maxMsg = {
          to: user.value.email,
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

      // schedule email on day the policy is supposed to be cancelled

      //create list
      const listData = {
        name: yourName.split(' ')[0] + yourName.split(' ')[1] + currentNumber,
      }

      const listRequest = {
        url: `/v3/marketing/lists`,
        method: 'POST',
        body: listData,
      }
      const listResponse = await sendgridClient.request(listRequest)

      console.log('list response >>> ', listResponse[0].body)

      const listId = listResponse[0].body.id
      console.log(' list id >>> ', listResponse[0].body.id)

      //create contact and add to list
      const contactData = {
        contacts: [
          {
            email: yourEmail,
          },
        ],
        list_ids: [listId],
      }

      const contactRequest = {
        url: `/v3/marketing/contacts`,
        method: 'PUT',
        body: contactData,
      }
      const contactResponse = await sendgridClient.request(contactRequest)

      console.log('contact response >>>> ', contactResponse[0].body)

      //duplicate single send

      const duplicateData = {
        name: `${yourName} ${currentNumber}`,
      }

      const duplicateRequest = {
        url: `/v3/marketing/singlesends/d158297e-519c-11ee-aa44-56282a5000f6`,
        method: 'POST',
        body: duplicateData,
      }

      const duplicateResponse = await sendgridClient.request(duplicateRequest)

      console.log(
        ' duplicate send response >>>> ',
        duplicateResponse[0].body.id
      )

      const newSingleSendId = duplicateResponse[0].body.id

      //schedule send
      const data = {
        send_at: 'now',
        send_to: { list_ids: [listId] },
      }

      const request = {
        url: `/v3/marketing/singlesends/${newSingleSendId}/schedule`,
        method: 'PUT',
        body: data,
      }

      const singleSendResponse = await sendgridClient.request(request)

      console.log('single send response >>>>', singleSendResponse[0].body)
    }

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
