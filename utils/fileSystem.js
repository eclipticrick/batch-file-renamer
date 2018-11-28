const fs = require('fs');
const path = require('path');

const getFilesAndFolders = (dir) => fs.readdirSync(dir);
const isDirectory = (dir) => fs.lstatSync(dir).isDirectory();

const pathIsAValidFolder = (directory) => {
    const pathExists = fs.existsSync(directory);
    if (pathExists) {
        const pathIsAFolder = fs.lstatSync(directory).isDirectory();
        return !!pathIsAFolder;
    }
    return false
};
const getFiles = (dir) => {
    return getFilesAndFolders(dir)
        .filter(name => !isDirectory(path.join(dir, name)))
};
const getFolders = (dir) => {
    return getFilesAndFolders(dir)
        .filter(name => isDirectory(path.join(dir, name)))
};
const createDummyFilesAndFolders = () => {
    const folderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
    const fileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];

    const directory = './tmp';

    deleteFolderRecursive(directory);

    createFolderIfItDoentExist(directory);

    createDummyData(directory, folderNames, fileNames);

    function deleteFolderRecursive(dir) {

        if (dir === '/') throw new Error('Are you sure you want to remove the root folder of this project? xD');

        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
                const curPath = path.join(dir, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    }
    function createFolderIfItDoentExist(dir) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
    function createDummyData(dir, folderNameArray, fileNameArray) {
        folderNameArray.forEach(folderName => {
            if (!fs.existsSync(path.join(dir, folderName))) {
                fs.mkdirSync(path.join(dir, folderName));
            }
        });
        fileNameArray.forEach(fileName => {
            if (!fs.existsSync(path.join(dir, fileName))) {
                fs.writeFile(path.join(dir, fileName), fileName + 'content', {flag: 'wx'}, (err) => {
                    if (err) console.warn(err)
                });
            }
        });
    }
};

module.exports = { pathIsAValidFolder, getFiles, getFolders, createDummyFilesAndFolders };