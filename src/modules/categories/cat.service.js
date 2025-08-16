import categoryRepo from './cat.repo.js';
import { ApplicationError } from '../../utils/errors.js';

class CategoryService {
    async createCategory(name, userId) {
        const category = await categoryRepo.create({ name, userId });
        return category;
    }

    async getCategories(userId) {
        const categories = await categoryRepo.findByUser(userId);
        return categories;
    }

    async updateCategory(id, name, userId) {
        const existingCategory = await categoryRepo.findByIdAndUser(id, userId);
        if (!existingCategory) {
            throw new ApplicationError('Category not found or unauthorized.', 404);
        }
        const updatedCategory = await categoryRepo.updateById({ id, name, userId });
        return updatedCategory;
    }

    async deleteCategory(id, userId) {
        const existingCategory = await categoryRepo.findByIdAndUser(id, userId);
        if (!existingCategory) {
            throw new ApplicationError('Category not found or unauthorized.', 404);
        }
        const deletedCategory = await categoryRepo.deleteById(id, userId);
        return deletedCategory;
    }
}

export default new CategoryService();