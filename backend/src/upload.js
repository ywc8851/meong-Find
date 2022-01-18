const multer = require('multer');

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: 'public/img/',
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

module.exports = upload;
