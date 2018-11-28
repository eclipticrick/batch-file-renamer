const fileSystem = require('./fileSystem');
const path = require('path');
const testingPath = path.join(__dirname, '..', 'tmp');
const testingFolderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
const testingFileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];
describe('fileSystem.js', () => {
    beforeAll(() => {
        fileSystem.createDummyFilesAndFolders()
    });
    describe('pathIsAValidFolder()', () => {
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
    describe('getFolders()', () => {
        const fn = fileSystem.getFolders;

        it('should get all files in the folder', () => {
            expect(fn(testingPath)).toEqual(testingFolderNames)
        })
    });
    describe('getFiles()', () => {
        const fn = fileSystem.getFiles;

        it('should get all files in the folder', () => {
            expect(fn(testingPath)).toEqual(testingFileNames)
        })
    })
});
