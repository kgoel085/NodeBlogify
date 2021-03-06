const express = require('express')
const router = express.Router()

const { createTag, getTags, getMatchingTags, getTagById, updateTag } = require('./../controllers/Tag')

// Create tag
router.post('/create', createTag)

// Get all the tags
router.get('/all', getTags)

// Get all tags matching a name
router.get('/search/:qry', getMatchingTags)

// Get tag from an id
router.get('/:id', getTagById)

// Update tag with an id
router.put('/:id', updateTag)

module.exports = router
