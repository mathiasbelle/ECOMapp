const Product = require('./product-model');

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
        console.log(product);
        if (product) {
            return product;    
        } else {
            throw new Error('Could not find product.');
        }
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

exports.updatePartial = async (id, {name, price, quantity, category, description}) => {

    await this.exists(id);

    let dataToUpdate = {};
    if (name) {
        dataToUpdate.name = name;
    }
    if (price) {
        dataToUpdate.price = price;
    }
    if (quantity) {
        dataToUpdate.quantity = quantity;
    }
    if (category) {
        dataToUpdate.category = category;
    }
    if (description) {
        dataToUpdate.description = description;
    }

    try {
        const product = Product.findByIdAndUpdate(id, dataToUpdate, {
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
    if ( !( await Product.exists({_id: id}))) {
        throw new Error('Product does not exist.');
    }
}

