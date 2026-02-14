const crypto = require('crypto');

class TaskModel {
    constructor(db) {
        this.db = db;
    }

    create({ title, description, status, due_date }) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, status, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(id, title, description || null, status || 'TODO', due_date, now, now);
        return this.findById(id);
    }

    findAll() {
        return this.db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    }

    findById(id) {
        return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    }

    updateStatus(id, status) {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
      UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?
    `);
        const result = stmt.run(status, now, id);
        if (result.changes === 0) return null;
        return this.findById(id);
    }

    update(id, { title, description, status, due_date }) {
        const existing = this.findById(id);
        if (!existing) return null;

        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
      UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, updated_at = ?
      WHERE id = ?
    `);
        stmt.run(
            title ?? existing.title,
            description !== undefined ? description : existing.description,
            status ?? existing.status,
            due_date ?? existing.due_date,
            now,
            id
        );
        return this.findById(id);
    }

    delete(id) {
        const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}

module.exports = TaskModel;
