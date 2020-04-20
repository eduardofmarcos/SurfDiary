const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/User');
const Feed = require('../models/Feed');

//********************** Multer - Start **********************/

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/feedImages');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   }
// });

const multerFilter = (req, file, cb) => {
  if (req.file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('denied'), false);
  }
};
const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage, filter: multerFilter });

//resizing photos
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/feedImages/${req.file.filename}`);

  next();
};
exports.uploadFeed = upload.single('photo');
//********************** Multer - End **********************/

exports.myFeed = async (req, res, next) => {
  const { _id } = await User.findById(req.user._id);

  const allOPhotos = await Feed.find({ _userId: _id }).sort({
    createdAt: '-1'
  });

  res.status(200).json({ status: 'success', data: allOPhotos });
};

exports.postPic = async (req, res, next) => {
  const { _id } = await User.findById(req.user._id);

  const newPic = await Feed.create({
    _userId: _id,
    comment: req.body.comment,
    ratingOfDay: req.body.ratingOfDay,
    photo: req.file.filename,
    location: req.body.location
  });

  res.status(200).json({ data: newPic });
};

exports.deletePic = async (req, res, next) => {
  const PicIdToDelete = req.params.id;
  await Feed.findByIdAndDelete(PicIdToDelete);

  res.status(204).json({});
};
