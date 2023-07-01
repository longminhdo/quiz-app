const XLSX = require('xlsx');

exports.isContain = (questionOptions, actualOption) => {
  let result;
  for (const a of actualOption) {
    result = questionOptions.some((el) => el.content === a.content);
    if (!result) return false;
  }
  return true;
};

exports.exportExcel = ({ fileName, header, rows }) => {
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
  const max_width = rows.reduce((w, r) => Math.max(w, r.length), 10);
  worksheet['!cols'] = [{ wch: max_width }];
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

exports.convertDataDepartment = (departments, parentId) => {
  const res = departments
    .filter((item) => item.DON_VI_ID.toString() !== parentId)
    .map((item) => ({
      id: String(item.DON_VI_ID),
      name: item.TEN_DON_VI,
      eName: item.TEN_TIENG_ANH,
      parentId: String(item.PARENT_ID),
      level: item.PHAN_LOAI,
    }));

  return res;
};

exports.parseSortOption = (sorter) => {
  if (!sorter) {
    return { updatedAt: -1 };
  }

  const direction = Array.from(sorter)[0] !== '-' ? 1 : -1;
  const sortField = direction === 1 ? sorter : sorter.substring(1);

  return ({ [sortField]: direction });
};