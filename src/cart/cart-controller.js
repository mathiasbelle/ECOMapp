const cartService = require('./cart-service');

exports.create = async (req, res) => {
    const data = {
        user: req.user,
        id: req.body.id,
        quantity: req.body.quantity,
        price: req.body.price

    };

    const cart = await cartService.create(data);
    console.log(cart);
    if (!cart) { 
        res.send('error');
    } else {
        res.send(cart);
    }
}