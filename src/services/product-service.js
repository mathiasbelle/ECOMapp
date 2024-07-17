const { writeFile, mkdir } = require('fs/promises');
const notFoundError = require('../errors/not-found-error');
const Product = require('../models/product-model');
const {join} = require('path');
exports.createProduct = async (data) => {
    const product = new Product({
        owner: data.owner,
        name: data.name,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: data.category,
        description: data.description,
    });

    async function getDestinationPath(productId) {
        const path =  join(__dirname, '..', '..', 'storage', 'images', 'products', productId);
        await mkdir(path, {recursive: true});
        return path;
    }

    if (data.files) {
        for (let i = 0; i < data.files.length; i++) {
            const filename = `${product.id}-${i}.${data.files[i].mimetype.split('/')[1]}`
            const path = join(await getDestinationPath(product.id), filename);
            await writeFile(path, data.files[i].buffer);
            product.images.push(join('storage', 'images', 'products', product.id, filename));
        }
    }

    try {
        await product.save();
        return product;
    } catch (error) {
        throw new Error('Could not create new product.');
    }
}

exports.getOneProduct = async (id) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Could not find product.');
        }
        return product;    
    } catch (error) {
        throw new Error('Could not find product.');
    }
    
}


/**
 * Generates a regular expression pattern from an array of words.
 *
 * @param {string[]} words - The array of words to generate the pattern from.
 * @return {RegExp} - The generated regular expression pattern.
 */
function makeQueryRegex(words) {
    let patternString = '^.*?\\b';

    words.forEach(item => {
        patternString += item + '\\b.*?';
    });

    patternString += '$';
    return new RegExp(patternString, 'i');
}

// If there's a name, need to use it to filter the products
exports.getAllProducts = async (name = '') => {
    // console.log(name);
    try {
        const query =
            name.trim().length > 0
                ? { name: makeQueryRegex(name.split(' ')) }
                : {};
        const products = await Product.find(query).lean();
        return products;
    } catch (error) {
        throw new Error('Error when getting products.');
    }
};

exports.getSellerProducts = async (id) => {
    try {
        const products = await Product.find({owner: id}).lean();
        return products;
    } catch (error) {
        throw new Error('Error when getting products.');
    }
}

exports.getProductsByUser = async (id) => {
    try {
        const products = await Product.find({owner: id}).lean();
        return products;
    } catch (error) {
        throw new Error('Error when getting products.');
    }
}

exports.updateProduct = async (id, data) => {
    await this.exists(id);
    const updatableFields = ['name', 'price', 'quantity', 'category', 'description'];

    try {
        const product = await Product.findById(id);
        if (!product) {
            throw notFoundError('Product does not exist.');
        }
        for (let [key, value] of Object.entries(data)) {
            if (value !== undefined && updatableFields.includes(key)) {
                product[key] = value;
            }
        }
        await product.save();

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
        throw notFoundError('Could not find product.');
    }
}

