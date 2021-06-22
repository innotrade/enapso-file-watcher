// Innotrade Enapso File Watcher
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze, Ashesh Goplani and Muhammad Yasir

// Demo
const { v4: uuidv4 } = require('uuid');
const { EnapsoFileWatcher } = require('../index');
const axios = require('axios');
const fs = require('fs');
let baseUrl = 'https://enapso.innotrade.com';
let headers =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaGVzaC5nb3BsYW5pQGdtYWlsLmNvbSIsImlkIjoiMjBlNTFiMGUtZDQwMy00ZTZiLTk5OWQtMThhZmY4YTRlNTU4IiwiaWF0IjoxNjIzODMzMjQ2fQ.Wi53upVb2lNXoIOq9HbeZb-QYO0ezzfnyuWRmo3cIEg';
let order = 10;
async function test() {
    await EnapsoFileWatcher.add([
        {
            path: 'C:/Users/HP/git/enapso-ontologies/EnapsoTruckOntology.owl',
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
        this.properties = await getProperties();
        await clearRepo();
        await uploadOntology();
        await checkProperty(this.properties);
        await buildCache();
        await generateApplication();
        console.log(message);
    });
}
function splitIRI(item) {
    let res = item.split('#');
    return res[1];
}
async function checkProperty(properties) {
    let prop = await getProperties();
    const results = prop.filter(
        ({ prop: id1 }) => !properties.some(({ prop: id2 }) => id2 === id1)
    );
    if (results.length) {
        console.log('new column added');
        for (const item of results) {
            await createColoumn(splitIRI(item.prop));
        }
    } else {
        console.log('Nothing Changed in Truck Class');
    }
}
async function createColoumn(prop) {
    let gridColumnIRI = await create({
        cls: 'http://ont.enapso.com/model/software#GridColumn',
        schema: 'Test',
        records: [
            {
                iri: 'http://ont.enapso.com/foundation#GridColumn' + uuidv4(),
                sortOrder: order + 1
            }
        ]
    });
    let gridColumnTextIRI = await create({
        cls: 'http://ont.enapso.com/model/software#Text',
        schema: 'Test',
        records: [
            {
                iri: 'http://ont.enapso.com/model/software#Text' + uuidv4(),
                value: prop
            }
        ]
    });
    let gridColumnIndexIRI = await create({
        cls: 'http://ont.enapso.com/model/software#DataIndex',
        schema: 'Test',
        records: [
            {
                iri:
                    'http://ont.enapso.com/model/software#DataIndex' + uuidv4(),
                value: prop
            }
        ]
    });

    await createRelation({
        schema: 'Test',
        child: gridColumnIndexIRI,
        property: 'http://ont.enapso.com/foundation#hasAttributes',
        parent: gridColumnIRI
    });
    await createRelation({
        schema: 'Test',
        child: gridColumnTextIRI,
        property: 'http://ont.enapso.com/foundation#hasAttributes',
        parent: gridColumnIRI
    });
    await createRelation({
        schema: 'Test',
        child: gridColumnIRI,
        property: 'http://ont.enapso.com/foundation#hasResources',
        parent: 'http://ont.enapso.com/truck/software#Grid_3b2e5ed0_3f5c_4e2a_a28e_69dc700caa90'
    });
    console.log(prop, gridColumnIRI, gridColumnIndexIRI, gridColumnTextIRI);
}

async function getProperties() {
    try {
        let response = await axios.post(
            `${baseUrl}/api/enapso/objects/v1/getSingleClassProperties`,
            {
                schema: 'Test',
                cls: 'http://ont.enapso.com/truck#Truck'
            },
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        return response.data.records;
    } catch (error) {
        console.error(error);
    }
}
async function clearRepo() {
    try {
        await axios.post(
            `${baseUrl}/api/enapso/objects/v1/clearContext`,
            {
                type: 'application/rdf+xml',
                context: 'http://ont.enapso.com/truck'
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
                    'C:/Users/HP/git/enapso-ontologies/EnapsoTruckOntology.owl',
                    'utf8'
                ),
                format: 'application/rdf+xml',
                baseIRI: 'http://ont.enapso.com/truck#',
                context: 'http://ont.enapso.com/truck'
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
                    'x-enapso-auth': headers
                }
            }
        );
        console.log('Application Generation Done');
    } catch (error) {
        console.error(error);
    }
}
async function create(data) {
    try {
        let response = await axios.post(
            `${baseUrl}/api/enapso/objects/v1/create`,
            data,
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        return response.data.records[0].iri;
    } catch (error) {
        console.error(error);
    }
}
async function createRelation(data) {
    try {
        let response = await axios.post(
            `${baseUrl}/api/enapso/objects/v1/createRelation`,
            data,
            {
                headers: {
                    'x-enapso-auth': headers
                }
            }
        );
        //  return response.data.records[0].iri;
    } catch (error) {
        console.error(error);
    }
}
test();
