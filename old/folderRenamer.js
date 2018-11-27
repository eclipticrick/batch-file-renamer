const fn = require('./functions');

const parentFolder = 'E:\\Some\\Folder';
const newName = (oldName) => oldName.replace('.en.srt', '.srt');

fn.readFolders(parentFolder, newName).then(() => fn.askToRenameFolders(parentFolder, newName));


