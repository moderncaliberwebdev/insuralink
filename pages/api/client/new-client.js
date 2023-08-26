// /api/client/new-client

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db'

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

    const user = await users.updateOne(
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
