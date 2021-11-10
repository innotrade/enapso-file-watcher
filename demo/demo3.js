// Innotrade Enapso File Watcher
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze, Ashesh Goplani and Muhammad Yasir

// Demo

const { EnapsoFileWatcher } = require('../index');
const axios = require('axios');
const fs = require('fs');
let baseUrl = 'https://enapso.innotrade.com';
let headers =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaEBnbWFpbC5jb20iLCJpZCI6ImI2NTRmMTk2LWY1MGMtNGRkYi1hNjA5LTMwMTY1YWRhNGY0MSIsImlhdCI6MTYzNDA0MDIzMn0.S1-yLtRiY5UjpK8SWYL4IzNRmglMUTt1tNUImJC1tHY';
async function test() {
    await EnapsoFileWatcher.add([
        {
            path: 'C:/Users/Ashesh/testOntologies/EBUCCDMOntology.owl',
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
        // await generateApplication();
        console.log(message);
    });
}
async function clearRepo() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/clearContext`,
            {
                type: 'application/rdf+xml',
                context: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore'
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
                    'C:/Users/Ashesh/testOntologies/EBUCCDMOntology.owl',
                    'utf8'
                ),
                format: 'application/rdf+xml',
                baseIRI:
                    'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#',
                context: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore'
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
// async function generateApplication() {
//     try {
//         await axios.post(
//             `${baseUrl}/api/enapso/objects/v1/generateApplication`,
//             {
//                 applicationIRI:
//                     'http://ont.enapso.com/truck/software#App_41f5cce4_0013_478b_865a_bab6974754d2'
//             },
//             {
//                 headers: {
//                     'X-Enapso-Auth': headers
//                 }
//             }
//         );
//         console.log('Application Generation Done');
//     } catch (error) {
//         console.error(error);
//     }
// }
test();
