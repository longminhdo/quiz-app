import { message } from 'antd';
import dayjs from 'dayjs';
import { pickBy, sortBy, uniq } from 'lodash';
import moment from 'moment';
import * as XLSX from 'xlsx';

export const isDiff = (A?: any, B?: any) => JSON.stringify(A) !== JSON.stringify(B);
export const convertTimeToTimeStamp = (time) => moment(time).unix();

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function forceProductionMode() {
  return false;
}

export function onlySpaces(text) {
  return text.trim().length === 0;
}

export const removeDuplicates = (array: any[]) => {
  if (array.length < 2) {
    return array;
  }

  return array.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
};

export const nonAccentVietnamese = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');

  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  str = str.replace(/[^a-z0-9]/gi, ' '); //remove nonalphanum character
  str = str.replaceAll('-', ' ');
  str = str.replace(/\s\s+/g, ' ');
  str = str.replaceAll(' ', '-');
  return str;
};

interface copyToClipboardProps {
  data: string;
  callbackMessage?: string;
}

export const copyToClipboard = ({ data, callbackMessage = 'Copied to clipboard.' }: copyToClipboardProps) => {
  navigator.clipboard.writeText(data);
  message.success(callbackMessage);
};

export function text2File(text, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const exportExcelFile = ({
  data,
  title,
  sheetName,
  width,
}: {
  data: Array<any>;
  title: string;
  sheetName: string;
  width?: number;
}) => {
  /*data under the format of
    [
      ["A1", "B1", "C1"],
      ["A2", "B2", "C2"],
      ["A3", "B3", "C3"]
    ]
  */

  const ws = XLSX.utils.aoa_to_sheet(data);
  if (width) ws['!cols'] = [{ wch: width }]; // set column A width to 10 characters
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, nonAccentVietnamese(sheetName));
  XLSX.writeFile(wb, `${title}.xlsx`);
};

export const deepCompare = (obj1, obj2) => {
  // If the objects have different types or lengths, they are not equal
  if (typeof obj1 !== typeof obj2 || Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // Compare each property of the objects recursively
  for (const prop in obj1) {
    if (typeof obj1[prop] === 'object') {
      if (!deepCompare(obj1[prop], obj2[prop])) {
        return false;
      }
    } else if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }

  return true;
};

export const findDuplicates = (array: Array<number | string>) => {
  if (!Array.isArray(array) || array.length < 2) {
    return [];
  }

  const sortedArray = array.slice().sort();
  const result: Array<number | string> = [];

  for (let i = 0; i < sortedArray.length - 1; ++i) {
    if (sortedArray[i + 1] === sortedArray[i]) {
      result.push(sortedArray[i]);
    }
  }

  return uniq(result);
};

export const getNewOptionContent = (options) => {
  let newOptionNumber = 0;
  const originalOptionRegex = /^(Option) \d+$/gm;
  const currentOptionNumbers = sortBy(
    options?.filter((opt) => opt?.content?.match(originalOptionRegex))?.map((opt) => Number(opt?.content.replace('Option ', ''))) || [],
  );

  if (currentOptionNumbers.length === 0 || currentOptionNumbers[0] !== 1) {
    newOptionNumber = 1;
  } else {
    const currentOptionNumbersLength = currentOptionNumbers.length;

    for (let i = 0; i < currentOptionNumbersLength - 1; i++) {
      if (currentOptionNumbers[i] <= currentOptionNumbers[i + 1] - 2) {
        newOptionNumber = currentOptionNumbers[i] + 1;
        break;
      }
    }

    if (newOptionNumber === 0) {
      newOptionNumber = currentOptionNumbers[currentOptionNumbersLength - 1] + 1;
    }
  }

  return `Option ${newOptionNumber}`;
};

export const moveElement = (array, fromIndex, toIndex) => {
  const element = array.splice(fromIndex, 1)[0];

  array.splice(toIndex, 0, element);

  return array;
};

export const convertTime = (time: number) => {
  if (!time) {
    return '';
  }

  return moment.unix(time).format('MMM DD, YYYY');
};

export const convertLabel = (value: number | string, enums: object) => {
  const found = enums?.[value];

  if (!found) {
    return value;
  }

  return found;
};

export const shuffleArray = (arr) => {
  const n = arr.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
};

export const formatDate = (date, dateFormat) => {
  if (!date) {
    return null;
  }

  if (dateFormat) {
    return dayjs(date, dateFormat);
  }

  return dayjs(date);
};

export const removeEmptyKeys = (obj) => {
  const result = pickBy(
    obj,
    (value) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0),
  );

  return result;
};
