const dayjs = require('dayjs');
const Form = require('../model/form');

module.exports.exportsToExcel = async (req, res) => {
  const header = [''];
  const rows = [];
  const { id } = req.params;
  const form = await Form.findById(id).populate('questions').populate('responses');
  const { questions, responses } = form;
  const { title } = form;
  const fileName = title.replace(/\s/g, '-');
  const questionIds = questions.map((q) => q._id);
  if (!form.isAllowAnonymous) {
    header.push('Email');
  }

  for (const question of questions) {
    header.push(question.title);
  }
  for (const response of responses) {
    const row = [];
    row.push(dayjs.unix(response.createdAt).format('DD-MM-YYYY hh:mm:ss'));

    if (header.includes('Email')) {
      if (response.user) {
        row.push(response.user);
      } else {
        row.push('');
      }
    }
    const reorderedResponse = questionIds.map((id) => response.options.find(({ questionId }) => questionId === id.toString()),
    );
    const optionRow = reorderedResponse.map((r) => {
      if (r?.option) {
        return r.option.map((a) => a.content).toString();
      }
      return '';
    });
    row.push(...optionRow);
    rows.push(row);
  }

  //const file = exportExcel({ fileName, header, rows });
  return res.status(200).send({ fileName, header, rows });
};
