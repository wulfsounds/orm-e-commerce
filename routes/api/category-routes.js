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
  Category.create(req.body)
    .then((category) => {
      // if there's category tags, we need to create pairings to bulk create in the Category model
      if (req.body.tagIds.length) {
        const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            category_id: category.id,
            tag_id,
          };
        });
        return Category.bulkCreate(categoryTagIdArr);
      }
      // if no category tags, just respond
      res.status(200).json(category);
    })
    .then((CategoryId) => res.status(200).json(CategoryId))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update category
router.put('/:id', async (req, res) => {
  try {
    await Category.update(req.body, { where: { id: req.params.id }})
    const categoryTags = await categoryTags.findAll({ where: { product_id: req.params.id }})
    const CategoryTagIds = categoryTags.map(({ tag_id }) => tag_id);
    const newCategoryTags = req.body.tagIds
    .filter((tag_id) => !CategoryTagIds.includes(tag_id))
    .map((tag_id) => { return { product_id: req.params.id, tag_id }})
    const categoryTagsToRemove = categoryTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    const updatedCategoryTags = await Promise.all([
      categoryTags.destroy({ where: { id: categoryTagsToRemove }}),
      categoryTags.bulkCreate(newCategoryTags)
    ])
    return res.status(200).json(updatedCategoryTags)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;