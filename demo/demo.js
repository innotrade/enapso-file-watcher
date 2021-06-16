// Innotrade Enapso File Watcher
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze, Ashesh Goplani and Muhammad Yasir

// Demo

const { EnapsoFileWatcher } = require('../index');
const axios = require('axios');
const fs = require('fs');
let baseUrl = 'https://enapso.innotrade.com';
let headers =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaGVzaC5nb3BsYW5pQGdtYWlsLmNvbSIsImlkIjoiMjBlNTFiMGUtZDQwMy00ZTZiLTk5OWQtMThhZmY4YTRlNTU4IiwiaWF0IjoxNjIzODMzNTUzfQ.QbZ46R4vEgnA-1JpU0OOcDpi6NvuV4jeRrkzGNlIkQ8';
async function test() {
    await EnapsoFileWatcher.add([
        {
            path: 'C:/Users/HP/git/enapso-ontologies/EnapsoSoftwareTruckApp - Updated.owl',
            id: '1232134'
        }
    ])
        .then(async (res) => {
            console.log('first', res);
        })
        .catch((err) => {
            console.log('Error', err);
        });

    await EnapsoFileWatcher.on('fileChanged', async function (message) {
        await clearRepo();
        await uploadOntology();
        await buildCache();
        await generateApplication();
        console.log(message);
    });
}
async function clearRepo() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/clearContext`,
            {
                type: 'application/rdf+xml',
                context: 'http://ont.enapso.com/truck/software'
            },
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        console.log('Clear Context Done');
    } catch (error) {
        console.error(error);
    }
}
async function uploadOntology() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/uploadOntologyFromData`,
            {
                fileData: fs.readFileSync(
                    'C:/Users/HP/git/enapso-ontologies/EnapsoSoftwareTruckApp - Updated.owl',
                    'utf8'
                ),
                format: 'application/rdf+xml',
                baseIRI: 'http://ont.enapso.com/truck/software#',
                context: 'http://ont.enapso.com/truck/software'
            },
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        console.log('upload Ontology Done');
    } catch (error) {
        console.error(error);
    }
}
async function buildCache() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/buildClassCache`,
            {},
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        console.log('Cache Done');
    } catch (error) {
        console.error(error);
    }
}
async function generateApplication() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/generateApplication`,
            {
                applicationIRI:
                    'http://ont.enapso.com/truck/software#App_41f5cce4_0013_478b_865a_bab6974754d2'
            },
            {
                headers: {
                    'X-Enapso-Auth': headers
                }
            }
        );
        console.log('Application Generation Done');
    } catch (error) {
        console.error(error);
    }
}
test();
