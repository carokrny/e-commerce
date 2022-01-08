const httpError = require('http-errors');
const { checkAddress } = require('../lib/validatorUtils');
const { attachIsPrimaryAddress } = require('../lib/formatUtils');
const Address = require('../models/AddressModel');
const User = require('../models/UserModel');

module.exports.postAddress = async (data) => {
    try {  
        const { address1, 
                address2,               // can be null
                city, 
                state,
                zip,
                country,
                isPrimaryAddress,        // can be null
                first_name, 
                last_name,
                user_id } = data;

        // check for valid inputs 
        if (address1 === null   || address1.length === 0    || 
            city === null       || city.length === 0        ||
            state === null      || state.length === 0       ||
            zip === null        || zip.length === 0         ||
            country === null    || country.length === 0     ||
            first_name === null || first_name.length === 0  ||
            last_name === null  || last_name.length === 0   ||
            user_id === null) {
                throw httpError(400, 'Invalid inputs');
        }

        // create address
        const address = await Address.create(data);

        // if isPrimaryAddress, update User
        if (isPrimaryAddress) {
            // primary payment stored in User to avoid conflict
            await User.updatePrimaryAddressId({ id: user_id, primary_address_id: address.id });
        }

        // attach isPrimaryAddress
        address.isPrimaryAddress = isPrimaryAddress ? isPrimaryAddress : false;

        return { address };

    } catch(err) {
        throw err;
    }
}

module.exports.getAddress = async (data) => {
    try {
        // validate inputs and grab address
        const address = await checkAddress(data);

        // primary address stored in User to prevent conflict
        const { primary_address_id } = await User.findById(data.user_id);

        // add boolean property indicating whether address is primary address
        attachIsPrimaryAddress(address, primary_address_id);

        return { address };

    } catch(err) {
        throw(err)
    }
}

module.exports.putAddress = async (data) => {
    try {
        // validate inputs and grab address
        const address = await checkAddress(data);

        // modify address with properties in data 
        for (const property in data) {
            if (property === "address1"     ||  
                property === "address2"     || 
                property === "city"         ||
                property === "state"        ||
                property === "zip"          ||
                property === "country"      ||
                property === "first_name"   ||
                property === "last_name") {
                // check that value is truthy not an empty string
                if (data[property] && data[property].length > 0) {
                    address[property] = data[property];
                }
            } 
        }

        // update address 
        const updatedAddress = await Address.update(address);

        // attach boolean property indicating whether address is primary address
        if (data.isPrimaryAddress) {
            // update User if true
            await User.updatePrimaryAddressId({ id: data.user_id, primary_address_id: updatedAddress.id });
            updatedAddress.isPrimaryAddress = true;

        } else {
            updatedAddress.isPrimaryAddress = false;
        }

        return { address: updatedAddress };

    } catch(err) {
        throw err;
    }
}

module.exports.deleteAddress = async (data) => {
    try {
        // validate inputs and grab address
        const address = await checkAddress(data);

        // grab user assocaited with address
        const { primary_address_id } = await User.findById(data.user_id);

        // attach info if address is primary address
        attachIsPrimaryAddress(address, primary_address_id);

        // check if address is primary address of user
        if (address.isPrimaryAddress) {
            // if so, update primary_address_id to be null
            await User.updatePrimaryAddressId({ id: data.user_id, primary_address_id: null });
        }

        // delete address
        const deletedAddress = await Address.delete(data.address_id);

        // add boolean property indicating whether address is primary address
        attachIsPrimaryAddress(deletedAddress, primary_address_id);
        
        return { address: deletedAddress };

    } catch(err) {
        throw(err)
    }
}

module.exports.getAllAddresses = async (user_id) => {
    try {
        // find addresses assocaited with user_id
        const addresses = await Address.findByUserId(user_id);

        // primary address stored in User to prevent conflict
        const { primary_address_id } = await User.findById(user_id);

        // add boolean property indicating whether address is primary address
        addresses.forEach(address => {
            attachIsPrimaryAddress(address, primary_address_id);
        });

        return { addresses };

    } catch(err) {
        throw err;
    }
}