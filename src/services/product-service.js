const notFoundError = require('../errors/not-found-error');
const Product = require('../models/product-model');

exports.createProduct = async (data) => {
    // console.log(data);
    const product = new Product({
        owner: data.owner,
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
        throw new Error('Could not create new product.');
    }
}

exports.getOneProduct = async (id) => {
    await this.exists(id);
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Could not find product.');
        }
        //console.log(product);
        return product;    
    } catch (error) {
        throw new Error('Could not find product.');
    }
    
}

exports.getAllProducts = async () => {
    try {
        const product = await Product.find();
        return product;
    } catch (error) {
        throw new Error('Error when getting products.')
    }

}

exports.updateProduct = async (id, data) => {
    console.log(id);
    await this.exists(id);
    const updatableFields = ['name', 'price', 'quantity', 'category', 'description'];
    let dataToUpdate = {};
    for (let [key, value] of Object.entries(data)) {
        if (value !== undefined && updatableFields.includes(key)) {
            dataToUpdate[key] = value;
        }
    }
    try {
        const product = await Product.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
        });
        return product;        
    } catch (error) {
        throw new Error('Error when updating product.')
    }
}

exports.deleteProduct = async (id) => {
    try {
        const product = Product.findByIdAndDelete(id);
        if (!product) {
            throw notFoundError('Product does not exist.');
        }
        return product;
    } catch (error) {
        return Error('Error when deleting product.');
    }
}

exports.exists = async (id) => {
    if (!(await Product.exists({_id: id}))) {
        throw notFoundError('Product does not exist.');
    }
}

