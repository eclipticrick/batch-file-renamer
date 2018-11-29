const fs = require('fs');
const path = require('path');

const getFilesAndFolders = (dir) => fs.readdirSync(dir);
const isDirectory = (dir) => fs.lstatSync(dir).isDirectory();

const pathIsAValidFolder = (dir) => {
    const pathExists = fs.existsSync(dir);
    if (pathExists) {
        const pathIsAFolder = fs.lstatSync(dir).isDirectory();
        return !!pathIsAFolder;
    }
    return false
};
const getFolders = (dir) => {
    return getFilesAndFolders(dir)
        .filter(name => isDirectory(path.join(dir, name)))
};
const getFiles = (dir) => {
    return getFilesAndFolders(dir)
        .filter(name => !isDirectory(path.join(dir, name)))
};
const replaceFolders = (dir, oldNames, newNames) => {
    // TODO: replace
};
const replaceFiles = (dir, oldNames, newNames) => {
    // TODO: replace
};

module.exports = { pathIsAValidFolder, getFiles, getFolders, replaceFolders, replaceFiles };