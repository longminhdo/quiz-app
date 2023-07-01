//const ObjectId = require("mongoose").Types.ObjectId;
const Question = require('../model/question');
const AppError = require('../helper/AppError');

module.exports.validateQuestionMedia = async (req, res, next) => {
  const { questionId } = req.params;
  const img = req.body;
  const question = await Question.find({
    $and: [
      { _id: questionId },
      {
        $or: [
          { 'questionMedia.filename': img.filename },
          { 'option.media.filename': img.filename },
        ],
      },
    ],
  });

  if (question.length === 0) { return next(new AppError(404, 'This media does not belong or does not exist in this question')); }
  return next();
};

// module.exports.validateAllQuestionMedias = async (req, res, next) => {
//   const { questionId } = req.params;
//   const question = req.body;
//   if (question.questionMedia) {
//     const result = await Question.find({
//       $and: [
//         { _id: questionId },
//         {
//           'questionMedia.filename': question.questionMedia.filename,
//         },
//         {
//           'questionMedia.url': question.questionMedia.url,
//         },
//       ],
//     });

//     if (result.length === 0) {
//       return next(
//         new AppError(404, 'This media does not belong or does not exist in this question'),
//       );
//     }
//   }

//   for (option of question.option) {
//     if (option.media) {
//       const result = await Question.find({
//         $and: [
//           { _id: questionId },
//           {
//             'option.media.filename': option.media.filename,
//           },
//           {
//             'option.media.url': option.media.url,
//           },
//         ],
//       });

//       if (result.length === 0) {
//         return next(
//           new AppError(404, 'This media does not belong or does not exist in this question'),
//         );
//       }
//     }
//   }

//   next();
// };
