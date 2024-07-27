const { Category } = require("../models/categoryModel.js");

const getCategoriesByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const categories = await Category.getAll(user_id);
    res.render("manageCategories", {
      title: "Manage Categories",
      user_id,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const createCategory = async (req, res) => {
  const { name, user_id } = req.body;

  try {
    const newCategory = await Category.create({ name, user_id });
    res.status(200).json({success: true, category: newCategory});
    //res.redirect(`/categories/user/${user_id}`);
  } catch (error) {
    res.status(500).json({success: false, error: 'Error adding category'}) 
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.delete(id);
    res.status(200).json({success: true, id});
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

module.exports = {
  getCategoriesByUserId,
  createCategory,
  deleteCategory,
};
