const betterConsole = require('better-console');
const defaultConfig = require('../../config');
const { getState } = require('../state');
const defaultFileSystem = require('../fileSystem');

const handlers = {

    // Before step 3
    showListOfFilesAndFoldersBeforeReplacement: (console = betterConsole, fileSystem = defaultFileSystem) => {
        console.log('this path contains the following folders and files:');
        fileSystem.getFolders(getState().path).forEach(folder => console.info(folder));
        fileSystem.getFiles(getState().path).forEach(file => console.log(file));
    },

    // Before step 8
    showListOfReplacedNames: (console = betterConsole, fileSystem = defaultFileSystem, config = defaultConfig) => {
        if(getState().folders) logList('folders', fileSystem.getFolders(getState().path));
        if(getState().files) logList('files', fileSystem.getFiles(getState().path));

        function logList(title, arr) {
            if (arr.length) {
                console.log(`\n${title}:`);
                console.log('[OLD]');
                arr.forEach((f, i) => console.log(i === arr.length - 1 ? '└──' : '├──', f));
                console.info('[NEW]');
                arr.forEach((f, i) => console.info(i === arr.length - 1 ? '└──' : '├──', config.actions[getState().action].fn(f)(...getState().args)));
            } else {
                console.log(`\nThere are no ${title} in this directory (type 'cancel' to go back to the beginning)!`);
            }
        }
    }
};

module.exports = handlers;
