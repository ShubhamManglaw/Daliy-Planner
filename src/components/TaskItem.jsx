import React from 'react';
import { Trash2 } from 'lucide-react';
import './TaskItem.css';

const PRIORITY_COLORS = {
    High: 'var(--pastel-pink)',
    Medium: 'var(--pastel-blue)',
    Low: 'var(--pastel-peach)',
};

const TaskItem = ({ task, onUpdate, onDelete }) => {
    const { id, title, completed, priority } = task;

    return (
        <div className={`task-item ${completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={completed}
                onChange={(e) => onUpdate(id, { completed: e.target.checked })}
                className="task-checkbox"
            />

            <input
                type="text"
                value={title}
                onChange={(e) => onUpdate(id, { title: e.target.value })}
                className="task-input"
                placeholder="Task name..."
            />

            <select
                value={priority}
                onChange={(e) => onUpdate(id, { priority: e.target.value })}
                className="task-priority"
                style={{ backgroundColor: PRIORITY_COLORS[priority] || '#eee' }}
            >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

            <button className="delete-btn" onClick={() => onDelete(id)} aria-label="Delete task">
                <Trash2 size={14} />
            </button>
        </div>
    );
};

export default TaskItem;
