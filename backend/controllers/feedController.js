const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/User');
const Feed = require('../models/Feed');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only pictures are allowed :)', 401), false);
  }
};
const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

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

exports.myFeed = catchAsync(async (req, res, next) => {
  const { _id } = await User.findById(req.user._id);

  const allOPhotos = await Feed.find({ _userId: _id }).sort({
    createdAt: '-1'
  });

  if (allOPhotos.length === 0)
    return res.status(200).json({
      status: 'success',
      message: ' This user has not post yet :('
    });

  res
    .status(200)
    .json({ status: 'success', length: allOPhotos.length, data: allOPhotos });
});

exports.postPic = catchAsync(async (req, res, next) => {
  const { _id } = await User.findById(req.user._id);

  const newPic = await Feed.create({
    _userId: _id,
    comment: req.body.comment,
    ratingOfDay: req.body.ratingOfDay,
    photo: req.file.filename,
    location: req.body.location
  });

  res.status(200).json({ data: newPic });
});

exports.deletePic = catchAsync(async (req, res, next) => {
  const PicIdToDelete = req.params.id;
  const picToDelete = await Feed.findByIdAndDelete(PicIdToDelete);

  if (!picToDelete)
    return next(new AppError('There is no picture with this Id :(', 404));

  res.status(204).json({});
});
