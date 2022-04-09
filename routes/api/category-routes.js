const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint


router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll(req.params.id, {
      include: [{ model: Product, through: Category, as: 'category_id' }]
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product, through: Category, as: 'category_id' }]
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
  // update category data
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from Category
      return Category.findAll({ where: { category_id: req.params.id } });
    })
    .then((Categories) => {
      // get list of current tag_ids
      const CategoryId = Categories.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newCategory = req.body.tagIds
        .filter((tag_id) => !CategoryId.includes(tag_id))
        .map((tag_id) => {
          return {
            category_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const categoryTagsToRemove = Categories
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Category.destroy({ where: { id: categoryTagsToRemove } }),
        Category.bulkCreate(newCategory),
      ]);
    })
    .then((updatedCategoryTags) => res.json(updatedCategoryTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
