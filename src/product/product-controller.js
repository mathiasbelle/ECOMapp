const productService = require('./product-service');

exports.create = async (req, res) => {
    const data = {
        id: req.user._id,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        description: req.body.description
    };

    const product = await productService.create(data);

    if ( !product ) {
        res.status(500).send({'error': 'Could not create new product.'});
    } else {
        res.send(product);
    }

}

exports.getOne = async (req, res) => {
    const id = req.params.id;
    const product = await productService.getOne(id);
    if ( !product ) {
        res.status(404).send({'error': 'Could not find product'});
    } else {
        res.send(product);
    }
    
}

exports.getAll = async (req, res) => {

    res.send(await productService.getAll());
    
}

exports.update = async (req, res) => {
    
}

exports.updatePartial = async (req, res) => {
    
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    const product = await productService.delete(id);
    if ( !product ) {
        res.status(404).send({'error': 'Product not  found'});
    } else {
        res.send(product);
    }
}