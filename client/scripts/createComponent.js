var fs = require('fs');
const fsPromise = require('fs').promises;
var dir = './tmp';

// print process.argv
let componentName = '';
let className = '';
let count = 0;
process.argv.forEach(function (val, index, array) {
  if (index >= 2) {
    componentName += titleCase(val).replace(/ /g, '');
    className += (count > 0 ? '-' : '') + val.toLowerCase().replace(/ /g, '-');
    count++;
  }
});
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}
async function upsertFile(name) {
  try {
    // try to read file
    await fs.promises.readFile(name);
  } catch (error) {
    // create empty file, because it wasn't found
    await fs.promises.writeFile(name, '');
  }
}

const componentContent = (
  name = '',
  className = ''
) => `import { FunctionComponent } from "react";
import "./${name}.scss";

interface ${name}Props {}

const ${name}: FunctionComponent<${name}Props> = () => {
  return <div className='${className}'>${name}</div>;
}

export default ${name};`;
const classContent = (className) => `@import '@/assets/styles/global.scss';

.${className} {
}`;

async function main(dir) {
  const fileName = `${process.env.INIT_CWD}/${dir}/${dir}.tsx`;
  await upsertFile(fileName);
  await fsPromise.writeFile(fileName, componentContent(dir, className));
  const fileNameScss = `${process.env.INIT_CWD}/${dir}/${dir}.scss`;
  await upsertFile(fileNameScss);
  await fsPromise.writeFile(fileNameScss, classContent(className));
}

if (componentName) {
  const dir = componentName;
  const folderName = `${process.env.INIT_CWD}/${dir}`;
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  } else {
  }
  main(dir);
}
