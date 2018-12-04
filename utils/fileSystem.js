const fs = require('fs');
const path = require('path');

const hasPermissions = dir => {
    try {

        // The file or directory exists
        fs.accessSync(dir, fs.constants.F_OK);

        // The file or directory has write permissions and is not in use at the moment
        fs.accessSync(dir, fs.constants.W_OK);

        // The file or directory has read permissions
        fs.accessSync(dir, fs.constants.R_OK);

        // The file or directory has stat & lstat permissions
        // (Information about the file or folder can be retrieved)
        fs.statSync(dir);
        fs.lstatSync(dir);

        return true
    }
    catch (err) {
        return false
    }
};

const getFilesAndFolders = dir => {
    if(!hasPermissions(dir)) return [];
    return fs.readdirSync(dir);
};
const isFile = (dir) => !fs.lstatSync(dir).isDirectory();
const isDirectory = (dir) => fs.lstatSync(dir).isDirectory();

const pathIsAValidFolder = dir => {
    const pathExists = fs.existsSync(dir);
    if (pathExists) {
        const pathIsAFolder = isDirectory(dir);
        return !!pathIsAFolder;
    }
    return false
};
const getFolders = dir => {
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
        if(hasPermissions(fullPathToFileOrFolder)) {
            return isFile(fullPathToFileOrFolder)
        }
        return false
    })
};
const replaceFolders = (dir, oldNames, newNames) => {
    if (oldNames.length !== newNames.length) {
        throw new Error('Old folderNames array and new folderNames array are not equal in size!')
    }
    const resultingNames = [];
    oldNames.forEach((oldName, i) => {
        try {
            fs.renameSync(
                path.join(dir, oldName),
                path.join(dir, newNames[i])
            );
            resultingNames.push(newNames[i]);
        } catch (e) {
            resultingNames.push(null);
        }
    });
    return resultingNames
};
const replaceFiles = (dir, oldNames, newNames) => {
    if (oldNames.length !== newNames.length) {
        throw new Error('Old fileNames array and new fileNames array are not equal in size!')
    }
    const resultingNames = [];
    oldNames.forEach((oldName, i) => {
        try {
            fs.renameSync(
                path.join(dir, oldName),
                path.join(dir, newNames[i])
            );
            resultingNames.push(newNames[i]);
        } catch (e) {
            resultingNames.push(null);
        }
    });
    return resultingNames
};

module.exports = { hasPermissions, pathIsAValidFolder, getFiles, getFolders, replaceFolders, replaceFiles };
