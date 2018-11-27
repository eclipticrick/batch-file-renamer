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
        path: 'C:\\Users\\wes_v\\Desktop\\OPIN',
        renameFolders: false,
        renameFiles: false
    },
    actions: {
        replace: {
            fn: (oldName) => (replaceString, withString) => oldName.replace(replaceString, withString),
            args: ['string to replace', 'replacement string']
        },
        reverse: {
            fn: (oldName) => () => oldName.split('').reverse().join(''),
            args: []
        },
        append:  {
            fn: (oldName) => (string) => oldName + string,
            args: ['string to append']
        },
        prepend: {
            fn: (oldName) => (string) => string + oldName,
            args: ['string to prepend']
        },
    }
};
