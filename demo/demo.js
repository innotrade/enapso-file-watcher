const { EnapsoFileWatcher } = require('../index');

EnapsoFileWatcher.add([
    { path: './watchfile/ashesh.txt', id: '1232134' },
    { path: './watchfile/dd.txt', id: '123' },
    { path: './watchfile/check.txt', id: 'as213123' },
    { path: './watchfile/ddddf.txt', id: 'as213123' }
])
    .then(async (res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });

// EnapsoFileWatcher.remove([{ path: './watchfile/check.txt', id: 'as213123' }])
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log('Error', err);
//     });

// EnapsoFileWatcher.removeAll()
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log('Error', err);
//     });
EnapsoFileWatcher.getWatched()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log('Error', err);
    });

EnapsoFileWatcher.on('fileChanged', function (message) {
    console.log(message);
});
