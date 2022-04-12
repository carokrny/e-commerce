const httpError = require('http-errors');
const { validateAddressInputs, validateAddress } = require('../lib/validatorUtils');
const { attachIsPrimaryAddress } = require('../lib/formatUtils');
const Address = require('../models/AddressModel');
const User = require('../models/UserModel');

module.exports.postAddress = async (data) => {
    try {  
        // validate inputs
        validateAddressInputs(data); 

        // create address
        const address = await Address.create(data);

        // if is_primary_address, update User
        if (data.is_primary_address) {
            // primary payment stored in User to avoid conflict
            await User.updatePrimaryAddressId({ id: data.user_id, primary_address_id: address.id });
        }

        // attach is_primary_address
        address.is_primary_address = data.is_primary_address ? true : false;

        return { address };

    } catch(err) {
        throw err;
    }
}

module.exports.getAddress = async (data) => {
    try {
        // validate inputs and grab address
        const address = await validateAddress(data);

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
        const address = await validateAddress(data);

        // modify address with properties in data 
        for (const property in data) {
            if (property === "address1"     ||  
                property === "address2"     || 
                property === "city"         ||
                property === "state"        ||
                property === "zip"          ||
                property === "country"      ||
                property === "first_name"   ||
                property === "last_name"
            ) {
                address[property] = data[property];
            } 
        }

        // validate each property before updating db
        validateAddressInputs(address);

        // update address 
        const updatedAddress = await Address.update(address);

        // attach boolean property indicating whether address is primary address
        if (data.is_primary_address) {
            // update User if true
            await User.updatePrimaryAddressId({ id: data.user_id, primary_address_id: updatedAddress.id });
            updatedAddress.is_primary_address = true;

        } else {
            updatedAddress.is_primary_address = false;
        }

        return { address: updatedAddress };

    } catch(err) {
        throw err;
    }
}

module.exports.deleteAddress = async (data) => {
    try {
        // validate inputs and grab address
        const address = await validateAddress(data);

        // grab user assocaited with address
        const { primary_address_id } = await User.findById(data.user_id);

        // attach info if address is primary address
        attachIsPrimaryAddress(address, primary_address_id);

        // check if address is primary address of user
        if (address.is_primary_address) {
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