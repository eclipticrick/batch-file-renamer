# Batch file renamer

For renaming multiple files at once in a folder
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need:
* [NodeJS and NPM](https://nodejs.org/) to install the dependencies for this project


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

Edit the path and renaming function to your needs *(index.js)*
```javascript
const path = 'E:\\Some\\Folder';
const newName = (oldName) => oldName.replace('.en.srt', '.srt');
```

Run the program
```
npm run start
```

## Authors

* **Wesley Veenendaal** - *Initial work* - [Github page](https://github.com/eclipticrick)

See also the list of [contributors](https://github.com/eclipticrick/batch-file-renamer/contributors) who participated in this project.

