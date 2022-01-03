const crypto = require('crypto');
const fs = require('fs');

function genKeyPair() {
    
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

    // Create the public key file
    fs.writeFileSync(__dirname + '../..' + '/pub_key.pem', keyPair.publicKey, 'utf8'); 
    
    // Create the private key file
    fs.writeFileSync(__dirname + '../..' + '/priv_key.pem', keyPair.privateKey, 'utf8');
}

genKeyPair();