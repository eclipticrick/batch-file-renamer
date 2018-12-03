const { setState } = require('../state');

const testingFolderNames = ['hello world aaa', 'hello world bbb', 'hello world ccc', 'hello world ddd', 'hello world eee'];
const testingFileNames =   ['test aaaaaa.txt', 'test bbbbbb.txt', 'test cccccc.txt', 'test dddddd.txt', 'test eeeeee.txt'];


const beforeQuestionHandler = require('./before');

global.console = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    log: jest.fn()
};
const fileSystemMock = {
    getFolders: () => testingFolderNames,
    getFiles: () => testingFileNames
};
const fileSystemMockEmpty = {
    getFolders: () => [],
    getFiles: () => []
};
const configMock = {
    actions: {
        toUpperCase: {
            fn: (oldName) => () => oldName.toUpperCase(),
            args: []
        }
    }
};
const shouldLogIfEmpty = (title) => `\nThere are no ${title} in this directory (type 'cancel' to go back to the beginning)!`;

describe('before.js', () => {
    describe('showListOfFilesAndFoldersBeforeReplacement()', () => {
        const fn = beforeQuestionHandler.showListOfFilesAndFoldersBeforeReplacement;
        it('should run without params and not throw an error', () => {
            expect(() => fn()).not.toThrowError()
        });
        it('should log the files and folders', () => {
            setState({ path: 'Some dir' });

            fn(console, fileSystemMock);

            expect(global.console.log).toHaveBeenCalledWith('this path contains the following folders and files:');

            fileSystemMock.getFolders().forEach(folderName => {
                expect(global.console.info).toHaveBeenCalledWith(folderName)
            });

            fileSystemMock.getFiles().forEach(fileName => {
                expect(global.console.log).toHaveBeenCalledWith(fileName)
            });

        });
    });
    describe('showListOfReplacedNames()', () => {
        const fn = beforeQuestionHandler.showListOfReplacedNames;
        it('should run without params and not throw an error', () => {
            expect(() => fn()).not.toThrowError()
        });
        it('should log the folders (toUpperCase)', () => {
            setState({
                path: 'Some dir',
                folders: true,
                files: false,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMock, configMock);

            shouldLogListToUppercase('folders', fileSystemMock.getFolders());
        });
        it('should log the files (toUpperCase)', () => {
            setState({
                path: 'Some dir',
                folders: false,
                files: true,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMock, configMock);

            shouldLogListToUppercase('files', fileSystemMock.getFiles());

        });
        it('should log the folders and the files (toUpperCase)', () => {
            setState({
                path: 'Some dir',
                folders: true,
                files: true,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMock, configMock);

            shouldLogListToUppercase('folders', fileSystemMock.getFolders());
            shouldLogListToUppercase('files', fileSystemMock.getFiles());
        });
        it('should log a message if the list of folders is empty', () => {
            setState({
                path: 'Some dir',
                folders: true,
                files: false,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMockEmpty, configMock);

            expect(fileSystemMockEmpty.getFolders()).toEqual([]);
            expect(global.console.log).toHaveBeenCalledWith(shouldLogIfEmpty('folders'));

        });
        it('should log a message if the list of files is empty', () => {
            setState({
                path: 'Some dir',
                folders: false,
                files: true,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMockEmpty, configMock);

            expect(fileSystemMockEmpty.getFiles()).toEqual([]);
            expect(global.console.log).toHaveBeenCalledWith(shouldLogIfEmpty('files'));
        });
        it('should log a message if the list of files or folders is empty', () => {
            setState({
                path: 'Some dir',
                folders: true,
                files: true,
                action: 'toUpperCase'
            });

            fn(console, fileSystemMockEmpty, configMock);

            expect(fileSystemMockEmpty.getFolders()).toEqual([]);
            expect(fileSystemMockEmpty.getFiles()).toEqual([]);
            expect(global.console.log).toHaveBeenCalledWith(shouldLogIfEmpty('folders'));
            expect(global.console.log).toHaveBeenCalledWith(shouldLogIfEmpty('files'));
        });
    });

});
function shouldLogListToUppercase(title, arr) {
    expect(global.console.log).toHaveBeenCalledWith(`\n${title}:`);
    expect(global.console.log).toHaveBeenCalledWith('[OLD]');

    arr.forEach((filesName, i) => {
        expect(global.console.log).toHaveBeenCalledWith(i === arr.length - 1 ? '└──' : '├──', filesName)
    });
    expect(global.console.info).toHaveBeenCalledWith('[NEW]');
    arr.forEach((filesName, i) => {
        expect(global.console.info).toHaveBeenCalledWith(i === arr.length - 1 ? '└──' : '├──', filesName.toUpperCase())
    })
}