const chai = require('chai');
const { expect } = require('chai');
const { EnapsoFileWatcher } = require('../index');

describe('Enapso File Watcher Test Cases', function () {
    it('Add Single File in Watcher', function () {
        EnapsoFileWatcher.add([
            { path: './test/testwatchfiles/ashesh.txt', id: '1232134' }
        ])
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Add Multiple Files in Watcher', function () {
        EnapsoFileWatcher.add([
            { path: './test/testwatchfiles/mar.txt', id: '123213454' },
            { path: './test/testwatchfiles/test.txt', id: '97567' },
            { path: './test/testwatchfiles/yasir.txt', id: '23456' }
        ])
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('When change occur show message', function (done) {
        EnapsoFileWatcher.on('fileChanged', function (message) {
            console.log(message);
        })
            .then((res) => {
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Remove Single file from Watcher by path', function () {
        EnapsoFileWatcher.remove([{ path: './test/testwatchfiles/test.txt' }])
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });

    it('Remove Single file from Watcher by id', function () {
        EnapsoFileWatcher.remove([{ id: '23456' }])
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });

    it('Remove Single file from Watcher by id and Path', function () {
        EnapsoFileWatcher.remove([
            { path: './test/testwatchfiles/mar.txt', id: '123213454' }
        ])
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });

    it('Watch all files from Watcher ', function () {
        EnapsoFileWatcher.getWatched()
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });

    it('Remove all files from Watcher', function () {
        EnapsoFileWatcher.removeAll()
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });

    
    it('Close the Watcher', function () {
        EnapsoFileWatcher.close()
            .then((res) => {
                expect(res).to.have.property('statusCode', 200);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    });
});
