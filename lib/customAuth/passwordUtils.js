const crypto = require('crypto');

/**
 * Returns obj with salt and hash of a plain text password
 * 
 * @param {string} pw plain text password
 * @return {Object} containing salt and hash properties
 */
module.exports.genPassword = (pw) => {
    // generate pseudorandom hex to be salt 
    const salt = crypto.randomBytes(32).toString('hex');

    // generate hash from salted pw with 100000 iterations and 64 byte len
    const hash = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: hash
    };
}

/**
 * Returns true if password is valid
 * 
 * @param {string} pw plain text password
 * @param {string} hash password hash
 * @param {string} salt psuedorandom hex value
 * @return {boolean} returns true if hash fn of salted pw matches hash
 */
module.exports.validPassword = (pw, hash, salt) => {
    // generate hash of salted pw using same cryptographic function as genPassword
    const pwHash = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex');

    return hash === pwHash;
}