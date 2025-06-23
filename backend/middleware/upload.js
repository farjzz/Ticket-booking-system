const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `${Date.now()}-${file.fieldname}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('Invalid file type. Upload JPEG/JPG/PNG files only.', false))
    }
}

const upload = multer({ storage, fileFilter })

module.exports = upload