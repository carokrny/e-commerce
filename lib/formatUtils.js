/**
 * Helper functions to wipe sensitive data from objects before returning 
 *
 */


/**
 * Helper function to check that:
 *      - wipes sensitive data, replacing chars with asterics 
 *      - formats expiry as MM/YYYY instead of Date object
 *
 * @param {Object} card the payment method to wipe
 */
module.exports.wipeCardData = card => {

    // format card_no as ************1234
    card.card_no = '************' + card.card_no.slice(-4);

    // format cvv as ***
    card.cvv = '***';

    // format expiry as MM/YYYY instead of Date object
    const year = card.expiry.getFullYear();
    let month = card.expiry.getMonth();
    if (month < 10) {
        month = '0' + month;
    } 
    card.expiry = month + '/' + year;
}

/**
 * Helper function to wipe password data before returning
 *
 * @param {Object} user the user to wipe
 */
 module.exports.wipePassword = user => {
    // delete password hash
    delete user.pw_hash;
    
    // delete password salt
    delete user.pw_salt;
 }