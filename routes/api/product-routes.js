const router = require('express').Router();
const { Product, Category, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll(req.params.id, {
      include: [{model: Category}]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
      }
      res.status(200).json(productData);
    } catch(err) {
      res.status(500).json(err);
    }
});

// create new product
router.post('/', async (req, res) => {
  // create a new product
  try {
    const productData = await Product.create(req.body);
    res.status(200).json(productData);
  } catch (err) {-
    res.status(400).json(err);
  }
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id }})
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id }})
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => { return { product_id: req.params.id, tag_id }})
    const productTagsToRemove = productTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove }}),
      ProductTag.bulkCreate(newProductTags)
    ])
    return res.status(200).json(updatedProductTags)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
