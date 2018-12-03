const fileSystem = require('./fileSystem');
const path = require('path');
const testingPath = path.join(__dirname, '..', 'tmp');
const testingFolderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
const testingFileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];
const nonExistingDirectories = [path.join(testingPath, 'nonExistingFolder'), '@', '{', '}', '\'', '>', '<', '|', ':', 'http://www.google.nl'];

let dummyFilesAndFoldersWereCreatedSuccessfully = createDummyFilesAndFolders();

describe('fileSystem.js', () => {
    if (!dummyFilesAndFoldersWereCreatedSuccessfully) {
        it('should fail if the dummy files and folders were not created successfully', () => {
            fail(`
Failed to delete & recreate the dummy files and folders in ${testingPath}
  |-- Make sure you don't have any of the files or folders opened.
  |-- Make sure you have read/write permissions in the specified path.
            `);
        })
    } else {
        describe('pathIsAValidFolder(dir: string): boolean', () => {
            const fn = fileSystem.pathIsAValidFolder;

            it('should be a valid folder', () => {
                expect(fn(testingPath)).toBeTruthy();
                testingFolderNames.forEach(folder => {
                    expect(fn(path.join(testingPath, folder))).toBeTruthy();
                })
            });
            it('should not be a valid folder if its a file', () => {
                testingFileNames.forEach(file => {
                    expect(fn(path.join(testingPath, file))).toBeFalsy();
                })
            });
            it('should not be a valid folder if it doesn\'t exist', () => {
                ['aaa', 'bbb', 'ccc', 'ddd', 'eee'].forEach(nonExistingFolder => {
                    expect(fn(path.join(testingPath, nonExistingFolder))).toBeFalsy();
                })
            });

        });
        describe('hasPermissions(dir: string): boolean', () => {
            const fn = fileSystem.hasPermissions;

            it('should not have permission on an invalid path', () => {
                nonExistingDirectories.forEach(dir => expect(fn(dir)).toEqual(false))
            })
        });
        describe('getFolders(dir: string): string[]', () => {
            const fn = fileSystem.getFolders;

            it('should get all folders in /tmp', () => {
                expect(fn(testingPath)).toEqual(testingFolderNames)
            });
            it('should not be able to get all folders in a non existing directory', () => {
                nonExistingDirectories.forEach(dir => expect(fn(dir)).toEqual([]));
            });
        });
        describe('getFiles(dir: string): string[]', () => {
            const fn = fileSystem.getFiles;

            it('should get all files in /tmp', () => {
                expect(fn(testingPath)).toEqual(testingFileNames)
            });
            it('should not be able to get all files in a non existing directory', () => {
                nonExistingDirectories.forEach(dir => expect(fn(dir)).toEqual([]));
            });

        });
        describe('replaceFolders()', () => {
            const fn = fileSystem.replaceFolders;
            const newFolderNames = ['x world aaa', 'x world bbb', 'x world ccc', 'x world ddd', 'x world eee'];

            it('should throw an error if the oldNames and newNames list are not equal in size', () => {
                expect(() => fn(testingPath, ['abc'], []))
                    .toThrowError('Old folderNames array and new folderNames array are not equal in size!')
            });
            it('should replace all sub folders in a folder', () => {
                expect(fn(testingPath, testingFolderNames, newFolderNames)).toEqual(newFolderNames);
                if (!resetDummyFilesAndFolders()) {
                    fail('Resetting dummy files has failed!');
                }
            });
            it('should replace all but one of the sub folders in a folder', () => {
                const oldFolderNames = [...testingFolderNames];
                oldFolderNames[0] = 'a non existing folder name';
                const expectedNewNames = [...newFolderNames];
                expectedNewNames[0] = null;
                expect(fn(testingPath, oldFolderNames, newFolderNames)).toEqual(expectedNewNames);

                if (!resetDummyFilesAndFolders()) {
                    fail('Resetting dummy files has failed!');
                }
            });
        });
        describe('replaceFiles()', () => {
            const fn = fileSystem.replaceFiles;
            const newFileNames = ['x aaaaaa.txt', 'x bbbbbb.txt', 'x cccccc.txt', 'x dddddd.txt', 'x eeeeee.txt'];

            it('should throw an error if the oldNames and newNames list are not equal in size', () => {
                expect(() => fn(testingPath, ['abc.txt'], []))
                    .toThrowError('Old fileNames array and new fileNames array are not equal in size!')
            });
            it('should replace all files in a folder', () => {
                expect(fn(testingPath, testingFileNames, newFileNames)).toEqual(newFileNames);

                if (!resetDummyFilesAndFolders()) {
                    fail('Resetting dummy files has failed!');
                }
            });
            it('should replace all but one of the files in a folder', () => {
                const oldFileNames = [...testingFileNames];
                oldFileNames[0] = 'a non existing file name.txt';
                const expectedNewNames = [...newFileNames];
                expectedNewNames[0] = null;
                expect(fn(testingPath, oldFileNames, newFileNames)).toEqual(expectedNewNames);

                if (!resetDummyFilesAndFolders()) {
                    fail('Resetting dummy files has failed!');
                }
            });
        })
    }
});
function resetDummyFilesAndFolders() {
    return createDummyFilesAndFolders()
}
function createDummyFilesAndFolders() {
    try {
        const fs = require('fs');
        const folderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
        const fileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];

        const directory = './tmp';

        deleteFolderRecursive(directory);

        createFolderIfItDoentExist(directory);

        createDummyData(directory, folderNames, fileNames);

        return true;

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
                    fs.writeFileSync(path.join(dir, fileName), '', {flag: 'wx'});
                }
            });
        }
    } catch (e) {
        return false
    }
}
