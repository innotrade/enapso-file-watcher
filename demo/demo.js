const { EnapsoFileWatcher } = require('../index');

EnapsoFileWatcher.add('dsd')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('here in cathc err', err);
    });

// EnapsoFileWatcher.on('fileChanged', function (message) {
//     console.log(message);
// });

// console.log(EnapsoFileWatcher);
