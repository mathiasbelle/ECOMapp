// const Cart = require('../cart/cart-model');

// exports.authenticateCartOwner = async (req, res, next) => {
//     try {
//         console.log(req.user);
//         console.log(req.user.id);
//         const cart = await Cart.findOne({owner: req.user.id}).exec();
//         console.log(cart.owner);
//         if (!cart || !(cart.owner.toString() === req.user._id.toString())) {
//             return res.sendStatus(403);
//         } else {
//             next();
//         }
//     } catch (error) {
//         return res.sendStatus(403);
//     }
// }