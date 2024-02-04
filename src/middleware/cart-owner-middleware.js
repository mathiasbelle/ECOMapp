const Cart = require('../cart/cart-model');

exports.authenticateCartOwner = async (req, res, next) => {
    const { id } = req.body.id;
    try {
        const cart = Cart.findById(id);
        console.log(cart.owner);
        if (!cart || !(cart.owner.toString() === req.user._id.toString())) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (error) {
        return res.sendStatus(403);
    }
}