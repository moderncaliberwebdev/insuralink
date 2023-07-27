// /api/client/all-companies

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

    let filteredCompanies = []

    companies.forEach((company) => {
      if (!company.admin) filteredCompanies.push(company)
    })

    res.json({ companies: filteredCompanies })
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
