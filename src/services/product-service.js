const notFoundError = require('../errors/not-found-error');
const Product = require('../models/product-model');

exports.create = async (data) => {
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

exports.getOne = async (id) => {
    await this.exists(id);
    try {
        const product = await Product.findById(id);
        //console.log(product);
        return product;    
    } catch (error) {
        throw new Error('Could not find product.');
    }
    
}

exports.getAll = async () => {
    try {
        const product = await Product.find();
        return product;
    } catch (error) {
        throw new Error('Error when getting products.')
    }

}

exports.updatePartial = async (id, data) => {
    console.log(id);
    await this.exists(id);
    let dataToUpdate = {};
    for (let [key, value] of Object.entries(data)) {
        if (value !== undefined) {
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

exports.delete = async (id) => {
    await this.exists();
    try {
        const product = Product.findByIdAndDelete(id);
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

