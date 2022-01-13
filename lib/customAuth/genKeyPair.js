const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function genKeyPair() {
    
    // only create new keys if needed
    if (!process.env.PUB_KEY || !process.env.PRIV_KEY) {

        // generates a Buffer obj where the keys are stored
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,         // standard for RSA keys
            publicKeyEncoding: {
                type: 'pkcs1',           // Public Key Cryptography Standards 1
                format: 'pem'            // Most common choice
            }, 
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });

        /**
         * NOTE: Cannot write .pem file directly to .env because of line breaks in .pem
         * But, new line breaks are needed for functions to read keys
         *
         * So, encode key as base64 so key is single line
         * Decode back to utf8 when using in files
         */

        // convert to base64 so key is one line
        const singleLinePubKey = Buffer.from(keyPair.publicKey).toString('base64');
        const singleLinePrivKey = Buffer.from(keyPair.privateKey).toString('base64');
        
        // path of .env file
        const envPath = path.resolve(__dirname, '../..', '.env');

        // add header comment to new section in .env file
        fs.appendFile(envPath,`\n# RSA Key Pair\n`, (err) => {
            if (err) {
                console.error(err.stack);
            }
        });

        // write public key to .env file
        fs.appendFile(envPath, `PUB_KEY=\"` + singleLinePubKey + `\"\n`, (err) => {
            if (err) {
                console.error(err.stack);
            } else {
                console.log('Added PUB_KEY to .env')
            }
        });

        // write private key to .env file
        fs.appendFile(envPath, `PRIV_KEY=\"` + singleLinePrivKey + `\"\n`, (err) => {
            if (err) {
                console.error(err.stack);
            } else {
                console.log('Added PRIV_KEY to .env')
            }
        });
    }
}

genKeyPair();