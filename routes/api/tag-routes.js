const router = require('express').Router();
const { Tag, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll(req.params.id, {
      include: [{ model: ProductTag, through: Tag, as: 'tagged_product' }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one tag by its `id` value
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: ProductTag, through: Tag, as: 'tagged_product' }]
    });
      res.status(200).json(tagData);
    } catch(err) {
      res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
  // create a new product
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
  Tag.create(req.body)
    .then((tags) => {
      // if there's tags tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const tagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: tags.id,
            tag_id,
          };
        });
        return Tag.bulkCreate(tagIdArr);
      }
      // if no tags tags, just respond
      res.status(200).json(tags);
    })
    .then((tagIds) => res.status(200).json(tagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
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
  // delete one tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
