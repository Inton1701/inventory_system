const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

const category = {
    // Get all categories
    getAllCategories: asyncHandler(async (req, res) => {
        try {
            const categoryList = await Category.find({status:{ $ne: 'deleted' }});
            res.status(200).json({ success: true, categories: categoryList });
        } catch (error) {
            res.status(500).json({ success: false, message: "Unable to fetch categories", error: error.message });
        }
    }),

    // Add category
    addCategory: asyncHandler(async (req, res) => {
        const { name, status } = req.body;

        // Check for missing fields
        if (!name) {
            return res.status(400).json({ success: false, message: "Name are required" });
        }

        try {
            const createdCategory = await Category.create({ name, status });
            res.status(201).json({ success: true, category: createdCategory });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
        }
    }),

    // Get category by ID
    getCategory: asyncHandler(async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            res.status(200).json({ success: true, category });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
        }
    }),

    // Update category by ID
    editCategory: asyncHandler(async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

            res.status(200).json({ success: true, category: updatedCategory });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error updating category", error: error.message });
        }
    }),

    // Soft delete category by ID (mark as deleted)
    softDeleteCategory: asyncHandler(async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            category.status = "deleted";
            await category.save();

            res.status(200).json({ success: true, message: "Category soft deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error soft deleting category", error: error.message });
        }
    }),

    // Permanently delete category by ID
    deleteCategory: asyncHandler(async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            await Category.deleteOne({ _id: req.params.id });

            res.status(200).json({ success: true, message: `Category ${req.params.id} deleted successfully` });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
        }
    }),
};

module.exports = category;
