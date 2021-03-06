const Product = require('../models/product');

// For Render add-product.ejs:
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

// For Post New Product:
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    /* Before Sequelize: 
    // Got moved to models:
    // products.push({ title: req.body.title });
    const product = new Product(null, title, imageUrl, price, description);
    product
    .save()
    .then(() => {
        res.redirect('/');
    })
    .catch(err => console.log(err));
    */

    /* Before Creating User Model:
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
        .then(result => {
            console.log(result);
            console.log('CREATED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
    */
    req.user.createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            console.log('CREATED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// For Load Edit Product Page:
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    /* Before Sequelize:
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product     
        });
    });
    */
    /* Before Creating User Model:
    Product.findById(prodId)
        .then(product =>{
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: 'admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
    */
    req.user.getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: 'admin/edit-product',                    
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

// For Save Edited Product:
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    /* Before Sequelize:
    const updatedProduct = new Product (
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedPrice,
        updatedDesc
    );
    updatedProduct.save();
    res.redirect('/admin/products');
    */
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    /* Before Sequelize:
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
    */
    /* Before Creating User Model:
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        });
    */
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    /* Before Sequelize:
    Product.deleteById(prodId);
    res.redirect('/admin/products');
    */
    Product.findById(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};