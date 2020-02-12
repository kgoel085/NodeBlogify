const CRUD = require('./../../services/CRUD')
const { UniqueConstraint, InvalidParam } = require('./../../helpers/error')
const { isType, validateObjectId } = require('./../../helpers')

class Post extends CRUD {
  constructor (db = null, schema = null, category = null) {
    super(db, 'posts', schema)
    this.category = category // Category Model
  }

  // Create category
  async createPost (obj = {}) {
    obj = this.schema(obj, true)

    // Validate values
    const { name, category } = obj

    // Validate & check for post name existence
    const { data: nameExists } = await this.checkForValue(name, 'name', false, true)
    if (nameExists) throw new UniqueConstraint(`Post with name (${name}) already exists !`)

    // Validate & check for categories
    await this.validatePostCategories(category)

    const result = await this.insert(obj)
    return result
  }

  // Update post
  async updatePost (obj = {}) {
    const { _id, ...details } = obj
    isType('databaseId', _id, 'id', true) // Check if a valid database id is provided

    // Get saved data
    const { data: postData } = await this.getPostById(_id)

    // Update data
    const { _id: postId, ...finalData } = this.schema({ ...postData, ...details }, true)
    const updateId = await this.makeDbId(postId)
    const result = await this.updateOne({ _id: updateId }, { $set: { ...finalData } })
    return result
  }

  // Get all post
  async getAllPost () {
    const result = await this.findAll({})
    return result
  }

  // Get post details by id
  async getPostById (id = null) {
    if (!id || !validateObjectId(id)) throw new InvalidParam('Invalid id provided !') // Post id to fetch

    // Post data
    const result = await this.findById(id)
    if (!result.data) result.msg = 'No data found !'

    return result
  }

  // Get all posts assigned to a category
  async getCategoryPost (categoryId = null) {
    if (!categoryId || !validateObjectId(categoryId)) throw new InvalidParam('Invalid category provided !') // Post id to fetch
    await this.validatePostCategories([categoryId])

    const result = await this.findAll({ category: { $all: [[categoryId]] } })
    return result
  }

  // Validate & check provided categories are valid or not
  async validatePostCategories (catArr = []) {
    isType('array', catArr, 'category', true)

    const returnVal = []
    for (const category of catArr) {
      const { data } = await this.category.checkCategory(category, true)
      if (!data) throw new InvalidParam('Invalid category provided !')

      returnVal.push(data)
    }

    return returnVal
  }
}

module.exports = Post
