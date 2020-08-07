const { EnapsoFileWatcher } = require('../index');

async function test() {
    await EnapsoFileWatcher.add([
        { path: './watchfile/ashesh.txt', id: '1232134' },
        { path: './watchfile/dd.txt', id: '123' },
        { path: './watchfile/ddddf.txt', id: 'as213123' }
    ])
        .then(async (res) => {
            console.log('first', res);
        })
        .catch((err) => {
            console.log('Error', err);
        });
    await EnapsoFileWatcher.on('fileChanged', function (message) {
        console.log(message);
    });

    // await EnapsoFileWatcher.remove([{ path: './watchfile/ashesh.txt' }])
    //     .then((res) => {
    //         console.log(res);
    //         // setTimeout(function () {
    //         // }, 3000);
    //     })
    //     .catch((err) => {
    //         console.log('Error', err);
    //     });

    await EnapsoFileWatcher.removeAll()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log('Error', err);
        });

    await EnapsoFileWatcher.add([
        { path: './watchfile/ashesh.txt', id: '1232134' }
    ])
        .then(async (res) => {
            console.log('first', res);
        })
        .catch((err) => {
            console.log('Error', err);
        });

    await EnapsoFileWatcher.getWatched()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log('Error', err);
        });
}

test();
