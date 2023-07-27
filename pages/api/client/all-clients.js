// /api/client/all-clients

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../../utils/db'
import { withAdminAuth } from '../../../middleware/adminAuth'

const router = createRouter()

// use connect based middleware
router.use(cors())

router.get(async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('insuralink')
    const users = db.collection('users')

    const companies = await users.find({}).toArray()

    let clients = []
    let companiesLength = 0

    companies.forEach((company) => {
      //filter the admins out of the companies and send a number of companies
      if (!company.admin) companiesLength += 1

      //filter the clients out of the company objects and put them in an array
      company.clients.forEach((client) => {
        clients.push(client)
      })
    })

    res.json({ clients, companies: companiesLength })
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

export default withAdminAuth(
  router.handler({
    onError(err, req, res) {
      res.status(500).json({
        error: err.message,
      })
    },
  })
)
