import { createRouter } from 'next-connect'
import cors from 'cors'
import multer from 'multer'
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    secretAccessKey: process.env.AWS_SECURE_SECRET_KEY,
    accessKeyId: process.env.AWS_SECURE_ACCESS_KEY_ID,
  },
  signatureVersion: 'v4',
})

//upload images to s3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'insuralink',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),
})

const router = createRouter()

// use connect based middleware
router.use(cors())
router.use(upload.single('file'))

router.post(async (req, res) => {
  try {
    res.send(req.file)
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

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}
