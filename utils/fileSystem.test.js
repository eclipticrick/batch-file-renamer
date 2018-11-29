const fileSystem = require('./fileSystem');
const path = require('path');
const testingPath = path.join(__dirname, '..', 'tmp');
const testingFolderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
const testingFileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];

describe('fileSystem.js', () => {
    beforeAll(() => createDummyFilesAndFolders());
    describe('pathIsAValidFolder(dir: string): boolean', () => {
        const fn = fileSystem.pathIsAValidFolder;

        it('should be a valid folder', () => {
            expect(fn(testingPath)).toBeTruthy();
            testingFolderNames.forEach(folder => {
                expect(fn(path.join(testingPath, folder))).toBeTruthy();
            })
        });
        it('should not be a valid folder', () => {
            testingFileNames.forEach(file => {
                expect(fn(path.join(testingPath, file))).toBeFalsy();
            })
        })
    });
    describe('getFolders(dir: string): string[]', () => {
        const fn = fileSystem.getFolders;

        it('should get all files in the folder', () => {
            expect(fn(testingPath)).toEqual(testingFolderNames)
        })
    });
    describe('getFiles(dir: string): string[]', () => {
        const fn = fileSystem.getFiles;

        it('should get all files in the folder', () => {
            expect(fn(testingPath)).toEqual(testingFileNames)
        })
    });
    describe('replaceFolders()', () => {
        const fn = fileSystem.replaceFolders;

        it.skip('should', () => {
            // TODO
        })
    });
    describe('replaceFiles()', () => {
        const fn = fileSystem.replaceFiles;

        it.skip('should', () => {
            // TODO
        })
    })
});

function createDummyFilesAndFolders() {
    const fs = require('fs');
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
}