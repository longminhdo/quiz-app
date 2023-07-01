const axios = require('axios');
const { convertDataDepartment } = require('../helper/utils');

exports.getDepartment = async (req, res, next) => {
  const { parentId } = req.query;
  try {
    const { data } = await axios.get(
      `https://dev-dot-hust-edu.appspot.com/partner/api/hemis/units?accessKey=uYenkgzlj5Vx4BrWQ89F-PARTNER&parentId=${parentId}`,
    );

    if (!data.data) {
      return;
    }
    const departments = convertDataDepartment(data.data, parentId);

    return res.status(200).send({ success: 'success', data: departments });
  } catch (error) {
    return next(error);
  }
};
