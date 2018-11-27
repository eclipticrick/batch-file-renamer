const fn = require('./functions');

const path = 'E:\\Some\\Folder';
const newName = (oldName) => oldName.replace('.en.srt', '.srt');

fn.readFiles(path, newName).then(() => fn.askToRenameFiles(path, newName));


