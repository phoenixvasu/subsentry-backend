import db from '../../config/db.js';
import { ApplicationError } from '../../utils/errors.js';

class CategoryRepo {
    async create({ name, userId }) {
        let client;
        try {
            client = await db.connect();
            const res = await client.query(
                'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
                [name, userId]
            );
            return res.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new ApplicationError('Category with this name already exists for this user.', 409);
            }
            throw new ApplicationError('Error creating category.', 500, error);
        } finally {
            if (client) client.release();
        }
    }

    async findByUser(userId) {
        let client;
        try {
            client = await db.connect();
            const res = await client.query(
                'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
                [userId]
            );
            return res.rows;
        } catch (error) {
            throw new ApplicationError('Error fetching categories.', 500, error);
        } finally {
            if (client) client.release();
        }
    }

    async findByIdAndUser(id, userId) {
        let client;
        try {
            client = await db.connect();
            const res = await client.query(
                'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
                [id, userId]
            );
            return res.rows[0];
        } catch (error) {
            throw new ApplicationError('Error fetching category.', 500, error);
        } finally {
            if (client) client.release();
        }
    }

    async updateById({ id, name, userId }) {
        let client;
        try {
            client = await db.connect();
            const res = await client.query(
                'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
                [name, id, userId]
            );
            return res.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new ApplicationError('Category with this name already exists for this user.', 409);
            }
            throw new ApplicationError('Error updating category.', 500, error);
        } finally {
            if (client) client.release();
        }
    }

    async deleteById(id, userId) {
        let client;
        try {
            client = await db.connect();
            const res = await client.query(
                'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
                [id, userId]
            );
            return res.rows[0];
        } catch (error) {
            if (error.code === '23503') { // Foreign key violation
                throw new ApplicationError('Category cannot be deleted because it is in use by a subscription.', 409);
            }
            throw new ApplicationError('Error deleting category.', 500, error);
        } finally {
            if (client) client.release();
        }
    }

    async transaction(callback) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            if (client) await client.query('ROLLBACK');
            throw error;
        } finally {
            if (client) client.release();
        }
    }
}

export default new CategoryRepo();