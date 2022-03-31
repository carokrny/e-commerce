const bcrypt = require('bcrypt');
const workFactor = 12;

/**
 * Returns obj with salt and hash of a plain text password
 * 
 * @param {string} pw plain text password
 * @return {Object} containing salt and hash properties
 */
module.exports.genPassword = async (pw) => {
    // generate pseudorandom hex to be salt 
    const salt = await bcrypt.genSalt(workFactor);

    // generate hash from salted pw 
    const hash = await bcrypt.hash(pw, salt);

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
module.exports.validPassword = async (pw, hash, salt) => {
    // generate hash of salted pw using same cryptographic function as genPassword
    const pwHash = await bcrypt.hash(pw, salt);

    return hash === pwHash;
}