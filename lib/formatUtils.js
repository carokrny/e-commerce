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


 /**
 * Helper function to check that:
 *      - checks if address is the user's primary address
 *      - attaches boolean property to address object, is_primary_address
 *
 * @param {Object} address the address object
 * @param {integer|null} primary_address_id the id of the user's primary address
 */
 module.exports.attachIsPrimaryAddress = (address, primary_address_id) => {
    if (primary_address_id) {
        address.is_primary_address = address.id === primary_address_id;
    } else {
        // base case if primary_address_id is null 
        address.is_primary_address = false;
    }
 }

 /**
 * Helper function to check that:
 *      - checks if payment method is the user's primary payment method
 *      - attaches boolean property to payment object, is_primary_payment
 *
 * @param {Object} payment the payment object
 * @param {integer|null} primary_payment_id the id of the user's primary payment method
 */
 module.exports.attachIsPrimaryPayment = (payment, primary_payment_id) => {
    if (primary_payment_id) {
        payment.is_primary_payment = payment.id === primary_payment_id;
    } else {
        // base case if primary_payment_id is null 
        payment.is_primary_payment = false;
    }
 }