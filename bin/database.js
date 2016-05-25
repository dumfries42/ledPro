
db.salespersons.insert({
    salesID: 0,
    loginName: 'test1',
    password: 'test1',
    name: 'Test Sale'
});


db.clients.insert({
    clientID: 0,
    salesID: 0,
    loginName: 'user1',
    password: 'user1',
    name: 'Test User'
});

db.products.insert({
    productID: 0,
    productName: 'Prodcut1',
    productionCondition: 'good'
});

db.events.insert({
    eventID: 0,
    clientID: 0,
    salesID: 0,
    productID: 0,
    from1: new Date("2016-05-10"),
    from2: new Date("2016-05-10"),
    end: new Date("2016-05-20"),
    deletedFlag : false,
});