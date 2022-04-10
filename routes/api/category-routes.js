const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll(req.params.id, {
      include: [{ model: Product, through: Category, as: 'category_id' }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
      }
      res.status(200).json(categoryData);
    } catch(err) {
      res.status(500).json(err);
    }
});

// create new product
router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update category
router.put('/:id', async (req, res) => {
  try {
    const updateCat = await Category.update(req.body, { where: { id: req.params.id }})
    return res.status(200).json(updatedCat)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteCat = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!deleteCat) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(deleteCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;