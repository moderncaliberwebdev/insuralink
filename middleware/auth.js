import { auth } from '../utils/firebase-admin'

export function withAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization
    const email =
      req.body.newEmail ||
      req.body.email ||
      req.query.email ||
      req.body.user ||
      ''

    if (!authHeader) {
      return res.status(401).end('Not authenticated. No Auth header')
    }

    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(token)
      console.log('auth >>>', email, decodedToken.email)
      if (!decodedToken || !decodedToken.uid)
        return res.status(401).end('Not authenticated')
      if (email.length > 0 && decodedToken.email != email)
        return res.status(401).end('Not authenticated')
      req.uid = decodedToken.uid
    } catch (error) {
      console.log(error.errorInfo)
      const errorCode = error.errorInfo.code
      error.status = 401
      if (errorCode === 'auth/internal-error') {
        error.status = 500
      }
      //TODO handlle firebase admin errors in more detail
      return res.status(error.status).json({ error: errorCode })
    }

    return handler(req, res)
  }
}
