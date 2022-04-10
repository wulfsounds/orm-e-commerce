const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const allTags = await Tag.findAll(req.params.id, {
      include: [{ model: Product }]
    });
    res.status(200).json(allTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one tag by its `id` value
  try {
    const findTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
      res.status(200).json(findTag);
    } catch(err) {
      res.status(400).json(err);
    }
});

// create new tag
router.post('/', async (req, res) => {
  // create a new category
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update tag
router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, { 
      where: { id: req.params.id }
    })
    return res.status(200).json(updateTag)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const deleteTags = await Tag.destroy({
      where: { id: req.params.id }
    });
    res.status(200).json(deleteTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
