# Batch file renamer

For renaming multiple files and/or sub-folders at once in a folder

[![Build Status](https://travis-ci.com/eclipticrick/batch-file-renamer.svg?branch=master)](https://travis-ci.com/eclipticrick/Ecliptic-OS)
[![Coverage Status](https://coveralls.io/repos/github/eclipticrick/batch-file-renamer/badge.svg?branch=master)](https://coveralls.io/github/eclipticrick/Ecliptic-OS?branch=master)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need:
* [NodeJS and NPM](https://nodejs.org/) to install the dependencies for this project (recommended version 6 or higher)


### Installing

A step by step series of examples that tell you how to get a development env running

Clone the repo.
```
git clone https://github.com/eclipticrick/batch-file-renamer.git batch-file-renamer
```

Install the dependencies in the newly created folder

```
cd batch-file-renamer
npm install
```

Run the program
```
npm run start
```

## Usage

(Optionally) Configure the defaults ```config.js```

```javascript
module.exports = {
    default: {
        path: 'C:\\Temp',
        renameFolders: false,
        renameFiles: true
    },
    actions: {
        reverse: {
            fn: oldName => () => oldName.split('').reverse().join(''),
            args: []
        },
        toUpperCase: {
            fn: oldName => () => oldName.toUpperCase(),
            args: []
        },
        append:  {
            fn: oldName => string => oldName + string,
            args: ['string to append']
        }
    }
};
```

Run the program to rename files & folders

![](https://media.giphy.com/media/RMxzoQAi3QIpwUZ50T/giphy.gif)

## Authors

* **Wesley Veenendaal** - *Initial work* - [Github page](https://github.com/eclipticrick)

See also the list of [contributors](https://github.com/eclipticrick/batch-file-renamer/contributors) who participated in this project.

