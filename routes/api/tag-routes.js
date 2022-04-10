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

router.post('/', async (req, res) => {
  try {
    await Tag.update(req.body, { where: { id: req.params.id }})
    const tags = await Tag.findAll({ where: { tag_id: req.params.id }})
    const tagIds = tags.map(({ tag_id }) => tag_id);
    const newTags = req.body.tagIds
    .filter((tag_id) => !tagIds.includes(tag_id))
    .map((tag_id) => { return { tag_id: req.params.id, tag_id }})
    const tagsToRemove = tags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    const updatedTags = await Promise.all([
      Tag.destroy({ where: { id: tagsToRemove }}),
      Tag.bulkCreate(newTags)
    ])
    return res.status(200).json(updatedTags)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

// update tag
router.put('/:id', async (req, res) => {
  try {
    await Tag.update(req.body, { where: { id: req.params.id }})
    const tags = await tags.findAll({ where: { product_id: req.params.id }})
    const tagIds = tags.map(({ tag_id }) => tag_id);
    const newTags = req.body.tagIds
    .filter((tag_id) => !tagIds.includes(tag_id))
    .map((tag_id) => { return { product_id: req.params.id, tag_id }})
    const tagsToRemove = tags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    const updatedTags = await Promise.all([
      tags.destroy({ where: { id: tagsToRemove }}),
      tags.bulkCreate(newTags)
    ])
    return res.status(200).json(updatedTags)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteTags = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!deleteTags) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(deleteTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
