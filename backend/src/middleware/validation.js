const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

function validateCreateTask(req, res, next) {
    const { title, status, due_date } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }
    if (title && title.trim().length > 255) {
        errors.push('Title must be 255 characters or fewer');
    }

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (!due_date) {
        errors.push('Due date is required');
    } else {
        const date = new Date(due_date);
        if (isNaN(date.getTime())) {
            errors.push('Due date must be a valid date/time');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.title = title.trim();
    if (req.body.description) {
        req.body.description = req.body.description.trim();
    }

    next();
}

function validateUpdateStatus(req, res, next) {
    const { status } = req.body;
    const errors = [];

    if (!status) {
        errors.push('Status is required');
    } else if (!VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

function validateUpdateTask(req, res, next) {
    const { title, status, due_date } = req.body;
    const errors = [];

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            errors.push('Title must be a non-empty string');
        }
        if (title.trim().length > 255) {
            errors.push('Title must be 255 characters or fewer');
        }
    }

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (due_date !== undefined) {
        const date = new Date(due_date);
        if (isNaN(date.getTime())) {
            errors.push('Due date must be a valid date/time');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    if (req.body.title) req.body.title = req.body.title.trim();
    if (req.body.description) req.body.description = req.body.description.trim();

    next();
}

module.exports = { validateCreateTask, validateUpdateStatus, validateUpdateTask, VALID_STATUSES };
