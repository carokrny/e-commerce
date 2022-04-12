/**
 * 
 * Data for running tests locally 
 * 
 */

//*********** USER TEST DATA ************************************************************************
const users = {
   // login for user that does exist in database
   // used in account, payment, auth, orders, and cart tests
   user1: {
      email: 'mascara@me.com', 
      password: '9UPQ?y-j',
      id: 1,
      first_name: 'Sam', 
      last_name: 'Mister'
   }, 
   // test user that is not used for log ins 
   // static test user for assignment to a static cart
   user2: {
      email: 'blue@colors.com', 
      password: 'uV69dQeu', 
      id: 2, 
      first_name: 'Blue', 
      last_name: 'Color'
   },
   // test login 3 since tests run synchronously and carts must have unique user_id
   // test login 3 is used for cartItems and address tests
   user3: {
      email: 'john@me.com', 
      password: 'R1JxNrQz', 
      id: 3, 
      first_name: 'John', 
      last_name: 'Doe'
   },
   // test login 4 since tests run synchronously and carts must have unique user_id
   // test login 4 is used for checkout tests
   user4: {
      email: 'arugula@me.com', 
      password: 'zjcl5E29', 
      id: 4, 
      first_name: 'Arugula', 
      last_name: 'Salad'
   },
   // test login 5 since tests run synchronously and carts must have unique user_id
   // test login 5 is used for checkout tests
   user5: {
      email: 'coffee@me.com', 
      password: 'zx3ZFudK', 
      id: 5,
      first_name: 'Coffee', 
      last_name: 'Cup'
   },
   // test login 6 since tests run synchronously and carts must have unique user_id
   // test login 6 is used for checkout e2e tests
   user6: {                    
      email: 'turkey@me.com', 
      password: 'zQAXD2vT', 
      id: 6,
      first_name: 'Turkey', 
      last_name: 'Dinner'
   },
   // test login 7 since tests run synchronously and carts must have unique user_id
   // test login 7 is used for checkout e2e tests
   user7: {                   
      email: 'pumpkin@me.com', 
      password: 'Wzv3Tmdu', 
      id: 7,
      first_name: 'Pumpkin', 
      last_name: 'Pie', 
      primary_address_id: 4, 
      primary_payment_id: 4
   },
   // test login 8 since tests run synchronously and carts must have unique user_id
   // test login 8 is used for checkout e2e tests
   user8: {                   
      email: 'pasta@me.com', 
      password: 'wgjNn4SI', 
      id: 8,
      first_name: 'Pasta', 
      last_name: 'Sauce', 
   }
}

// test registration for user that does not exist in database
const testRegister = {
    email: 'orange@me.com', 
    password: '5Co0c4SC',
    first_name: 'Orange',
   last_name: 'Color'
 };

// test registration for user that does not exist in database
// for checkout e2e tests
const testRegister2 = {
   email: 'yellow@me.com', 
   password: 'bgZqJa1z',
   first_name: 'Yellow',
   last_name: 'Color'
};

const userAccountPut = {
   first_name: 'Sam', 
}
//******************************************************************************************************


//*********** PRODUCT TEST DATA ************************************************************************
const products = {
   product1: {  
      id: 1,
      name:'T-Shirt',
      price: 19.99,
      description: 'Pima cotton unisex t-shirt',
      quantity: 1000,
      category: 'tops'
   }, 
   product2: {
      id: 2,
      name:'Pants',
      price: 39.99,
      description: 'Fitted twill pants',
      quantity: 1000,
      category: 'bottoms'
   },
   product3: {
      id: 3,
      name:'Jacket',
      price: 54.99,
      description: 'Structured jacket for layering',
      quantity: 1000,
      category: 'tops'
   }
}

// test product for entering into carts and orders
const product = {
    product_id: products.product1.id, 
    quantity: 2
};

// updated quantity to product for updating cart
const updatedProduct = {
    product_id: products.product1.id,
    quantity: 5
};
//******************************************************************************************************


//*********** CART TEST DATA ***************************************************************************
const carts = {
   cart1: {
      id: 1,
      user_id: users.user2.id
   }
}
//******************************************************************************************************


//*********** CART_ITEM TEST DATA **********************************************************************
const cart_items = {
   cartItem1: {
      cart_id: carts.cart1.id, 
      product_id: products.product1.id,
      quantity: 2
   }, 
   cartItem2: {
      cart_id: carts.cart1.id, 
      product_id: products.product2.id,
      quantity: 3
   }
}
//******************************************************************************************************


//*********** ADDRESS TEST DATA ************************************************************************
const addresses = {
   address1: {
      id: 1, 
      address1: '643 Minna St', 
      address2: 'Apt 3', 
      city: 'San Francisco', 
      state: 'CA', 
      zip: '94103',
      country: 'United States', 
      user_id: users.user1.id, 
      first_name: users.user1.first_name, 
      last_name: users.user1.last_name
   }, 
   address2: {
      id: 2, 
      address1: '123 Easy St', 
      address2: 'Apt 1', 
      city: 'Springfield', 
      state: 'IL', 
      zip: '11111',
      country: 'United States', 
      user_id: users.user1.id, 
      first_name: users.user1.first_name, 
      last_name: users.user1.last_name
   },
   address3: {
      id: 3, 
      address1: '40 Main St', 
      address2: 'Apt 6', 
      city: 'Springfield', 
      state: 'IL', 
      zip: '11111',
      country: 'United States', 
      user_id: users.user2.id, 
      first_name: users.user2.first_name, 
      last_name: users.user2.last_name
   }, 
   address4: {
      id: 4, 
      address1: '123 Easy St', 
      address2: null, 
      city: 'San Francisco', 
      state: 'CA', 
      zip: '94103',
      country: 'United States', 
      user_id: users.user7.id, 
      first_name: users.user7.first_name, 
      last_name: users.user7.last_name
   }
}

const addressPost = {
    address1: '123 Easy St',
    city: 'San Francisco', 
    state: 'CA', 
    zip: '94103', 
    country: 'United States', 
    isPrimaryAddress: false
}

const addressPut = {
    address2: 'Apt 5', 
    isPrimaryAddress: true
}

// to get an error on address routes with wrong address id
const differentAddressId = addresses.address1.id;
//******************************************************************************************************


//*********** PAYMENT TEST DATA ************************************************************************
const cards = {
   card1: {
      id: 1, 
      user_id: users.user1.id,
      provider: 'Matercard',
      card_no: '5555555555554444',
      card_type: 'credit',
      cvv: '567',
      exp_month: 5,
      exp_year: 2024,
      billing_address_id: addresses.address2.id
   },
   card2: {
      id: 2, 
      user_id: users.user1.id,
      provider: 'Visa',
      card_no: '4000056655665556',
      card_type: 'debit',
      cvv: '789',
      exp_month: 7,
      exp_year: 2024,
      billing_address_id: addresses.address2.id
   },
   card3: {
      id: 3, 
      user_id: users.user2.id,
      provider: 'Matercard',
      card_no: '5200828282828210',
      card_type: 'debit',
      cvv: '345',
      exp_month: 12,
      exp_year: 2024,
      billing_address_id: addresses.address3.id
   },
   card4: {
      id: 4, 
      user_id: users.user7.id,
      provider: 'Visa',
      card_no: '4242424242424242',
      card_type: 'credit',
      cvv: '123',
      exp_month: 1,
      exp_year: 2025,
      billing_address_id: addresses.address4.id
   },
}

// Note billing_address_id is associated with user_id = 21
const cardPost = {
   card_type: 'debit', 
   provider: 'Visa', 
   card_no: '4000056655665556', 
   cvv: '123', 
   exp_month: 11,
   exp_year: 2023, 
   billing_address_id: addresses.address1.id, 
   isPrimaryPayment: false,
}

const cardPut = {
   provider: 'MasterCard', 
   isPrimaryPayment: true
}

// Note billing_address_id is associated with user_id = 21
const invalidCardPost = {
   card_type: 'debit', 
   provider: 'Visa', 
   card_no: '123412G412341234', 
   cvv: '123', 
   exp_month: 12,
   exp_year: 2020, 
   billing_address_id: addresses.address1.id
}

const invalidCardPut = {
   exp_month: 11,
   exp_year: 2020,           // date has passed
}

// to get an error on payment routes with wrong payment id
const differentPaymentId = cards.card3.id;
//******************************************************************************************************


//*********** ORDER TEST DATA **************************************************************************
const orders = {
   order1: {
      id: 1, 
      user_id: users.user1.id,
      status: 'pending', 
      shipping_address_id: addresses.address1.id,
      billing_address_id: addresses.address1.id,
      payment_id: cards.card1.id,
      amount_charged: 279.91,
      stripe_charge_id: 'test'
   },
   order2: {
      id: 2, 
      user_id: users.user1.id,
      status: 'pending', 
      shipping_address_id: addresses.address1.id,
      billing_address_id: addresses.address1.id,
      payment_id: cards.card2.id,
      amount_charged: 39.98,
      stripe_charge_id: 'test'
   }
}
//******************************************************************************************************


//*********** ORDER_ITEM TEST DATA **************************************************************************
const order_items = {
   orderItem1: {
      order_id: orders.order1.id,
      product_id: products.product1.id,
      quantity: 2
   }, 
   orderItem2: {
      order_id: orders.order1.id,
      product_id: products.product2.id,
      quantity: 5
   }, 
   orderItem3: {
      order_id: orders.order2.id,
      product_id: products.product1.id,
      quantity: 2
   }
}
//******************************************************************************************************

const xssAttack = ' <script>Alert (“XSS!”)</script>';

module.exports = {
   users, 
   products,
   carts,
   cart_items,
   addresses,
   cards,
   orders,
   order_items, 
   testRegister, 
   testRegister2, 
   userAccountPut, 
   product, 
   updatedProduct,
   addressPost,
   addressPut, 
   differentAddressId, 
   cardPost,
   cardPut,
   invalidCardPost, 
   invalidCardPut, 
   differentPaymentId,
   xssAttack
};