const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

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
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
    // Tag.create(req.body)
  //   .then((tag) => {
  //     // if there's tag tags, we need to create pairings to bulk create in the Tag model
  //     if (req.body.tagIds.length) {
  //       const tagIdArr = req.body.tagIds.map((tag_id) => {
  //         return {
  //           category_id: tag.id,
  //           tag_id,
  //         };
  //       });
  //       return Tag.bulkCreate(tagIdArr);
  //     }
  //     // if no tag tags, just respond
  //     res.status(200).json(tag);
  //   })
  //   .then((TagId) => res.status(200).json(TagId))
});

// update tag
router.put('/:id', async (req, res) => {
  // update tag data
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }});
    res.status(200).json(tagData);
  } catch {
    res.status(400).json(err)
  }

  // try {
  //   Tag.update(req.body, {
  //     where: {
  //       id: req.params.id,
  //     }
      
  //   } res.status(200).json(tagData)
  // } catch {

  // }

    // .then((tag) => {
    //   // find all associated tags from Tag
    //   return Tag.findAll({ where: { category_id: req.params.id } });
    // })
    // .then((Tag) => {
    //   // get list of current tag_ids
    //   const TagId = Tag.map(({ tag_id }) => tag_id);
    //   // create filtered list of new tag_ids
    //   const newTag = req.body.tagIds
    //     .filter((tag_id) => !TagId.includes(tag_id))
    //     .map((tag_id) => {
    //       return {
    //         category_id: req.params.id,
    //         tag_id,
    //       };
    //     });
    //   // figure out which ones to remove
    //   const tagsToRemove = Tag
    //     .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    //     .map(({ id }) => id);

    //   // run both actions
    //   return Promise.all([
    //     Tag.destroy({ where: { id: tagsToRemove } }),
    //     Tag.bulkCreate(newTag),
    //   ]);
    // })
    // .then((updatedTags) => res.json(updatedTags))
    // .catch((err) => {
    //   // console.log(err);
    //   res.status(400).json(err);
    // });
});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
