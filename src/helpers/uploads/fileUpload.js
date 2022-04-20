const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../../utils/AppError/appError');
const storage = multer.memoryStorage();
const { uuidv4 } = require('../uploads/aws/aws_sdk');
// uuidv4();
console.log(uuidv4);

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image! kindly upload only images', 400), false);
  }
};

function resizePhoto(entity) {
  return async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `${entity}-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./src/public/images/${entity}/${req.file.filename}`);
    next();
  };
}

const upload = multer({ storage, fileFilter });

module.exports = {
  resizePhoto,
  upload,
};
