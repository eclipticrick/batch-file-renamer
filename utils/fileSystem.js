const fs = require('fs');
const path = require('path');

const hasPermissions = (dir) => {
    try {

        // The file or directory exists
        fs.accessSync(dir, fs.constants.F_OK);

        // The file or directory has execute permissions
        fs.accessSync(dir, fs.constants.X_OK);

        // The file or directory has write permissions and is not in use at the moment
        fs.accessSync(dir, fs.constants.W_OK);

        // The file or directory has read permissions
        fs.accessSync(dir, fs.constants.R_OK);

        // The file or directory has stat & lstat permissions
        // (Information about the file or folder can be retrieved)
        fs.statSync(dir);
        fs.lstatSync(dir);

        // TODO: check if the file is in use / blocked

        return true
    }
    catch (err) {
        return false
    }
};

const getFilesAndFolders = (dir) => {
    if(!hasPermissions(dir)) return [];
    return fs.readdirSync(dir);
};
const isFile = (dir) => !fs.lstatSync(dir).isDirectory();
const isDirectory = (dir) => fs.lstatSync(dir).isDirectory();

const pathIsAValidFolder = (dir) => {
    const pathExists = fs.existsSync(dir);
    if (pathExists) {
        const pathIsAFolder = isDirectory(dir);
        return !!pathIsAFolder;
    }
    return false
};
const getFolders = (dir) => {
    return getFilesAndFolders(dir).filter(name => {
        const fullPathToFileOrFolder = path.join(dir, name);
        if(hasPermissions(fullPathToFileOrFolder)) {
            return isDirectory(fullPathToFileOrFolder)
        }
        return false
    })
};
const getFiles = (dir) => {
    return getFilesAndFolders(dir).filter(name => {
        const fullPathToFileOrFolder = path.join(dir, name);
        console.info('x', name, fullPathToFileOrFolder, hasPermissions(fullPathToFileOrFolder), isFile(fullPathToFileOrFolder))
        if(hasPermissions(fullPathToFileOrFolder)) {
            return isFile(fullPathToFileOrFolder)
        }
        return false
    })
};
const replaceFolders = (dir, oldNames, newNames) => {
    // if (oldNames.length !== newNames.length)
    // TODO: replace
};
const replaceFiles = (dir, oldNames, newNames) => {
    // TODO: replace
};

module.exports = { hasPermissions, pathIsAValidFolder, getFiles, getFolders, replaceFolders, replaceFiles };
