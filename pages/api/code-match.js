// /api/code-match

import { createRouter } from 'next-connect'
import cors from 'cors'
import clientPromise from '../../utils/db'

const router = createRouter()

// use connect based middleware
router.use(cors())

router.get(async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('insuralink')
    const users = db.collection('users')

    const user = await users.findOne({ code: req.query.code })
    res.json({ user })
  } catch (e) {
    res.json({ message: 'No User' })
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
