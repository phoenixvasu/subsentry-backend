import categoryService from './cat.service.js';

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const { name } = req.body;
            const userId = req.user.id; // Assuming user ID is available from auth middleware
            const category = await categoryService.createCategory(name, userId);
            res.status(201).json({ message: 'Category created successfully', data: category });
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const userId = req.user.id;
            const categories = await categoryService.getCategories(userId);
            res.status(200).json({ message: 'Categories fetched successfully', data: categories });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const userId = req.user.id;
            const updatedCategory = await categoryService.updateCategory(id, name, userId);
            res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await categoryService.deleteCategory(id, userId);
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();