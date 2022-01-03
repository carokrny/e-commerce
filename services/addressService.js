const httpError = require('http-errors');
const { checkAddress } = require('../lib/validatorUtils');
const Address = require('../models/AddressModel');
const User = require('../models/UserModel');

module.exports.postAddress = async (data) => {
    try {  
        const { address1, 
                address2,   // can be empty
                city, 
                state,
                zip,
                country,
                user_id } = data;

        // check for valid inputs 
        if (address1 === null   || address1.length === 0 || 
            city === null       || city.length === 0    ||
            state === null      || state.length === 0   ||
            zip === null        || zip.length === 0     ||
            country === null    || country.length === 0 ||
            user_id === null) {
                throw httpError(400, 'Invalid inputs');
        }

        // create address
        const address = await Address.create(data);

        return { address };

    } catch(err) {
        throw err;
    }
}

module.exports.getAddress = async (data) => {
    try {
        const address = await checkAddress(data);

        return { address };

    } catch(err) {
        throw(err)
    }
}

module.exports.putAddress = async (data) => {
    try {
        const address = await checkAddress(data);

        // modify address with properties in data 
        for (const property in data) {
            if (property === "address1" ||  
                property === "address2" || 
                property === "city" ||
                property === "state" ||
                property === "zip" ||
                property === "country") {
                // check that value is truthy not an empty string
                if (data[property] && data[property].length > 0) {
                    address[property] = data[property];
                }
            } 
        }

        // update address 
        const updatedAddress = await Address.update(address);

        return { address: updatedAddress };

    } catch(err) {
        throw err;
    }
}

module.exports.deleteAddress = async (data) => {
    try {
        await checkAddress(data);

        // grab user assocaited with address
        const user = await User.findById(data.user_id);

        // check if address is primary address of user
        if (user.primary_address_id === parseInt(data.address_id)) {
            // if so, update primary_address_id to be null
            await User.update({ ...user, primary_address_id: null });
        }

        // delete address
        const deletedAddress = await Address.delete(data.address_id);
        
        return { address: deletedAddress };

    } catch(err) {
        throw(err)
    }
}

module.exports.getAllAddresses = async (user_id) => {
    try {
        // find addresses assocaited with user_id
        const addresses = await Address.findByUserId(user_id);

        return { addresses };

    } catch(err) {
        throw err;
    }
}