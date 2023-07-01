const XLSX = require('xlsx');
const fs = require('fs');

(async () => {
  const document = await XLSX.readFile('./Bo-cau-hoi-khao-sat.xlsx');
  const workSheet = document.Sheets[document.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(workSheet, { header: 1 });

  const templates = {};
  data.forEach((row, index) => {
    if (index === 0) {
      return;
    }

    const templateId = row[0];
    const templateName = row[1];

    const questionAndAnswer = {
      questionId: row[2],
      question: row[3],
      answerId: row[4],
      answer: row[5],
    };

    if (!templates[templateId]) {
      templates[templateId] = {
        title: templateName,
        data: [questionAndAnswer],
      };
      return;
    }

    templates[templateId].data.push(questionAndAnswer);
  });

  const transformedTemplates = {};
  Object.keys(templates).forEach((templateId) => {
    const { data } = templates[templateId];

    const questions = {};
    data.forEach(questionAndAnswer => {
      const { questionId, question, answer } = questionAndAnswer;

      if (!questions[questionId]) {
        questions[questionId] = {
          title: question,
          type: 'radio',
          required: true,
          otherAnswerAccepted: false,
          options: [{ content: answer }],
        };
        return;
      }

      questions[questionId].options.push({ content: answer });
    });

    transformedTemplates[templateId] = {
      title: templates[templateId].title,
      questions,
    };
  });

  const finalResult = Object.keys(transformedTemplates).map((templateId) => {
    const template = transformedTemplates[templateId];
    const questionsAsArray = Object.keys(template.questions).map(questionId => template.questions[questionId]);
    return {
      title: template.title,
      questions: questionsAsArray,
    };
  });

  fs.writeFileSync('./bo-cau-hoi.json', JSON.stringify(finalResult));
})();