CREATE TABLE task_assignees (
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Migrar los datos existentes a la nueva tabla puente
INSERT INTO task_assignees (task_id, user_id)
SELECT id, user_id FROM tasks WHERE user_id IS NOT NULL;

-- Eliminar la llave foranea original y la columna user_id
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
ALTER TABLE tasks DROP COLUMN user_id;
