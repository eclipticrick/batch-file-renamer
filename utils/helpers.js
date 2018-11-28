const is = require('./is');

const stringIsEmpty = (path) => {
    is.requiredString(path, 'path');
    return !path.replace(/\s/g, '')
};

const confirm = (input) => {
    is.requiredString(input, 'input');
    input = input.toLowerCase();
    if (['', 'y', 'yes'].includes(input)) {
        return true
    } else if (['n', 'no'].includes(input)) {
        return false
    } else {
        return null
    }
};

module.exports = {
    stringIsEmpty,
    confirm
};
