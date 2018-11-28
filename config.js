/**
 * Renaming configuration
 *
 * If you're missing an action, you can add it here!
 *
 * When adding args, make sure they can be read in the following sentence:
 * 'This function requires a  ...  '
 */
module.exports = {
    default: {
        path: 'D:\\Projects\\npm\\batch-renamer\\tmp',
        renameFolders: false,
        renameFiles: false
    },
    actions: {
        replaceFirst: {
            fn: (oldName) => (replaceString, withString) => oldName.replace(replaceString, withString),
            args: ['string to replace', 'replacement string']
        },
        replace: {
            fn: (oldName) => (replaceString, withString) => {
                const re = new RegExp(replaceString, 'g');
                return oldName.replace(re, withString);
            },
            args: ['string to replace', 'replacement string']
        },
        reverse: {
            fn: (oldName) => () => oldName.split('').reverse().join(''),
            args: []
        },
        toLowerCase: {
            fn: (oldName) => () => oldName.toLowerCase(),
            args: []
        },
        toUpperCase: {
            fn: (oldName) => () => oldName.toUpperCase(),
            args: []
        },
        append:  {
            fn: (oldName) => (string) => oldName + string,
            args: ['string to append']
        },
        prepend: {
            fn: (oldName) => (string) => string + oldName,
            args: ['string to prepend']
        }
    }
};
