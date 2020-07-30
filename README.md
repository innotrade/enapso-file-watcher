# enapso-file-watcher

Enapso file watcher which can help in watching file and if any change occur user can recieve the message with the time of change occur file path name and id to run the test cases just wrote the npm test command on terminal and you can see the results also in demo folder a demo.js file which can also run to see the demo of different method available in this package.
To discuss questions and suggestions with the enapso, we'll be happy to meet you in our forum at https://www.innotrade.com/forum/.

# Installation

```
npm i enapso-file-watcher --save
```

# Require the package

```
const { EnapsoFileWatcher } = require('enapso-file-watcher');
```

# Examples

# Add a File in watcher

```javascript
EnapsoFileWatcher.add([
    { path: './watchfile/ashesh.txt', id: '1232134' },
    { path: './watchfile/dd.txt', id: '123' },
    { path: './watchfile/check.txt', id: 'as213123' }
])
    .then(async (res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });
```

To add a file or more than a file just need to pass the `path` and `id` of the file using the json array object format and it will be added successfully and we can watch if any change occur on this file.

# On method

```javascript
EnapsoFileWatcher.on('fileChanged', function (message) {
    console.log(message);
});
```

on method which need to call when you want to see the `filename`, `id`, `path` and `time of change` occur in a file separatly it show us these information in our termianl when a change in a file which you added in watch.

# Remove Method

```javascript
EnapsoFileWatcher.remove([{ path: './watchfile/check.txt', id: 'as213123' }])
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });
```

Remove method which you can use to remove a single file or more than one file from watcher from which you need to pass the `path` or `id` or both (`path` and `id` )to remove a file using json array object fromat which can not be watch more.

# Remove All Method

```javascript
EnapsoFileWatcher.removeAll()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });
```

Remove all method which remove all the files which are in watcher.

# Get All Files in watcher

```javascript
EnapsoFileWatcher.getWatched()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });
```

Get watched method which retreive all files `path` and their `id` which are in watcher.
