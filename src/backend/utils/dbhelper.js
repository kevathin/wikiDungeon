export function openDatabase(){
    return new Promise((resolve, reject) => {

        // request to open or create the database
        const request = indexedDB.open('WikiDungeon',1);

        // if the db is outdated or doesn't exist, it will require an upgrade
        // this creates a read/write transaction if upgrade is needed
        request.onupgradeneeded = async function(event){
            
            // fetch the database from the event
            const db = event.target.result;

            if (!db.objectStoreNames.contains('Monstor')){
                const store = db.createObjectStore('Monstor', {keyPath: "level", autoIncrement: false});
                store.createIndex('level', 'level', {unique: true});
                store.createIndex('question', 'question', {unique: false});
                store.createIndex('ansNum', 'ansNum', {unique: false});
                store.createIndex('opt1', 'opt1', {unique: false});
                store.createIndex('opt2', 'opt2', {unique: false});
                store.createIndex('opt3', 'opt3', {unique: false});
                store.createIndex('opt4', 'opt4', {unique: false});
            }

            if (!db.objectStoreNames.contains('Keydata')){
                const store = db.createObjectStore('Keydata', {keyPath: "keyval", autoIncrement: false});
                store.createIndex('keyval', 'keyval', {unique: true});
                store.createIndex('val', 'val', {unique: false});
            }

            if (!db.objectStoreNames.contains('Dialogue')){
                const store = db.createObjectStore('Dialogue', {keyPath: "character", autoIncrement: false});
                store.createIndex('character', 'character', {unique: false});
                store.createIndex('part', 'part', {unique: false});
                store.createIndex('content', 'content', {unique: false});
            }
        }
        // If database exists, return the database instance.
        request.onsuccess = function(event) {
            const db = event.target.result;
            resolve(db);
        }

        // If an error occurs, pray
        request.onerror = function(event) {
            reject(event.target.error);
        }
    });
}