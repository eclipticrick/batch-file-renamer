module.exports = {
    stringIsEmpty: (path) => !path.replace(/\s/g, ''),
    confirm: (input) => {
        input = input.toLowerCase();
        if (['', 'y', 'yes'].includes(input)) {
            return true
        } else if (['n', 'no'].includes(input)) {
            return false
        } else {
            return null
        }
    }
};
