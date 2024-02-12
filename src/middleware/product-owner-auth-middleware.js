const Product = require('../product/product-model');

exports.authenticateProductOwner = async (req, res, next) => {
    const productId = req.params.id;
    console.log(productId);
    try {
        const product = await Product.findById(productId);
        //console.log(product);
        //console.log(product.owner);
        //console.log(req.user._id);
        if (!product || !(product.owner.toString() === req.user._id.toString())) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (error) {
        return res.sendStatus(403);  
    }
}