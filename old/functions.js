const fs = require('fs');
const readline = require('readline');
const console = require('better-console');

module.exports =  {
    readFiles: (path, newName) => {
        console.log('This is what the renamed files will look like:');
        console.log('');

        return new Promise((resolve) => {
            fs.readdir(path, (err, files) => {
                files.forEach((fileName, i) => {
                    console.log(` |--[${i}] old -> ${fileName}`);
                    console.info(` |--[${i}] new -> ${newName(fileName)}`);
                });
                resolve()
            })
        })
    },
    askToRenameFiles: (path, newName) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Are you sure you want to rename the files? (y/n) ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                console.log('new names:');
                console.log('');

                fs.readdir(path, (err, files) => {
                    files.forEach(fileName => {
                        fs.rename(path + '/' + fileName, path + '/' + newName(fileName), function (err) {
                            if (err) throw err;
                            console.info(` |--${newName(fileName)}`);
                        })
                    })
                })
            } else console.warn('renaming canceled');
            rl.close();
        })
    },
    readFolders: (path, newName) => {
        console.log('This is what the renamed folders will look like:');
        console.log('');

        return new Promise((resolve) => {
            fs.readdir(path, (err, files) => {
                files.forEach((fileName, i) => {
                    if(path.join(path, file).isDirectory()) {
                        console.log(` |--[${i}] old -> ${file}`);
                        console.info(` |--[${i}] new -> ${newName(file)}`);
                    }
                });
                resolve()
            })
        });
    },
    askToRenameFolders: (path, newName) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Are you sure you want to rename the files? (y/n) ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                // console.log('new names:');
                // console.log('');

                // fs.readdir(path, (err, files) => {
                //     files.forEach(fileName => {
                //         fs.rename(path + '/' + fileName, path + '/' + newName(fileName), function (err) {
                //             if (err) throw err;
                //             console.info(` |--${newName(fileName)}`);
                //         })
                //     })
                // })
            } else console.warn('renaming canceled');
            rl.close();
        })
    }
};
