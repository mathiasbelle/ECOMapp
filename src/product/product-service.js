const Product = require('./product-model');

exports.create = async (data) => {
    console.log(data);
    const product = new Product({
        owner: data.id,
        name: data.name,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: data.category,
        description: data.description,
        
    });
    console.log(product);

    try {
        await product.save();
        return product;
    } catch (error) {
        console.log('Error when saving new product');
        console.log(error);
        return false;
    }
}

exports.getOne = async (id) => {
    return await Product.findById(id);
}

exports.getAll = async () => {
    return await Product.find();

}

exports.updatePartial = async (id, data) => {
    delete data.owner;

}

exports.delete = async (id) => {
    console.log(id);
    try {
        const product = Product.findByIdAndDelete(id);
        if ( !product ) {
            return false;
        } else {
            return product;
        }
    } catch (error) {
        return false;
    }
}

