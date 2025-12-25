import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle, Circle, Clock, Calendar } from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner';
import { DonutChart } from './Analytics/ProgressChart';
import './DailyView.css';

const DailyView = () => {
    // Date management could be moved to a useDate hook or similar context
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    const { getDateData, addTask, toggleTask, deleteTask, addGoal, toggleGoal, deleteGoal, updateNotes, getDailyStats, getCategoryColor, addToGoogleCalendar, addCategory, getCategories, updateCategory } = usePlanner();
    const data = getDateData(currentDate);

    // Form states
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isAddingGoal, setIsAddingGoal] = useState(false);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState('');
    const [newGoalText, setNewGoalText] = useState('');

    // Category Management
    // const [isManagingCategories, setIsManagingCategories] = useState(false); // Moved to top-level view
    const categories = getCategories();

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        addTask(currentDate, {
            title: newTaskTitle,
            time: newTaskTime,
            category: newTaskCategory || 'General'
        });
        setNewTaskTitle('');
        setNewTaskTime('');
        setNewTaskCategory('');
        setIsAddingTask(false);
    };

    const handleAddGoal = () => {
        if (!newGoalText.trim()) return;
        addGoal(currentDate, newGoalText);
        setNewGoalText('');
        setIsAddingGoal(false);
    };

    // Format date for display
    const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isToday = currentDate === new Date().toISOString().split('T')[0];

    return (
        <div className="daily-view">
            <div className="view-header">
                <button className="nav-btn" onClick={() => {
                    const prevDay = new Date(currentDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setCurrentDate(prevDay.toISOString().split('T')[0]);
                }}><ChevronLeft size={20} /></button>
                <div className="date-display">
                    <h2>{formattedDate}</h2>
                    {isToday && <span className="today-badge">Today</span>}
                </div>
                <button className="nav-btn" onClick={() => {
                    const nextDay = new Date(currentDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setCurrentDate(nextDay.toISOString().split('T')[0]);
                }}><ChevronRight size={20} /></button>
            </div>

            {/* ... existing goals section ... */}
            <div className="daily-stats-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="goals-section">
                    <div className="section-header">
                        <h3>Today's Top Goals</h3>
                        <button className="add-btn-small" onClick={() => setIsAddingGoal(true)}><Plus size={16} /></button>
                    </div>

                    <div className="goals-list">
                        {data.goals.map(goal => (
                            <div key={goal.id} className="goal-item" onClick={() => toggleGoal(currentDate, goal.id)}>
                                {goal.completed ? <CheckCircle size={18} className="icon-checked" /> : <Circle size={18} className="icon-unchecked" />}
                                <span className={goal.completed ? 'completed-text' : ''}>{goal.text}</span>
                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteGoal(currentDate, goal.id); }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        {isAddingGoal && (
                            <div className="new-goal-input">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter goal..."
                                    value={newGoalText}
                                    onChange={(e) => setNewGoalText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                                    <button className="cancel-btn" onClick={() => setIsAddingGoal(false)}>Cancel</button>
                                    <button className="confirm-btn" onClick={handleAddGoal}>Add</button>
                                </div>
                            </div>
                        )}

                        {!isAddingGoal && data.goals.length === 0 && (
                            <div className="empty-state">No goals set for today</div>
                        )}
                    </div>
                </div>

                {/* Daily Progress Chart */}
                <div className="progress-card" style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h3>Day Progress</h3>
                    <DonutChart data={getDailyStats(currentDate)} />
                </div>
            </div>

            <div className="daily-content-grid">
                {/* Schedule & Tasks */}
                <div className="tasks-column">
                    <div className="section-header">
                        <h3>Schedule & Tasks</h3>
                        <button className="primary-btn-small" onClick={() => setIsAddingTask(true)}>
                            <Plus size={14} /> Add Task
                        </button>
                    </div>

                    <div className="tasks-list">
                        {isAddingTask && (
                            <div className="task-input-card">
                                <input
                                    className="task-title-input"
                                    autoFocus
                                    type="text"
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                />
                                <div className="task-meta-inputs">
                                    <input
                                        type="time"
                                        value={newTaskTime}
                                        onChange={(e) => setNewTaskTime(e.target.value)}
                                    />
                                    <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                                        <select
                                            value={newTaskCategory}
                                            onChange={(e) => setNewTaskCategory(e.target.value)}
                                            style={{
                                                padding: '8px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                flex: 1,
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="">Select Category...</option>
                                            {categories.map(cat => (
                                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="task-actions">
                                    <button className="cancel-btn" onClick={() => setIsAddingTask(false)}>Cancel</button>
                                    <button className="confirm-btn" onClick={handleAddTask}>Add Task</button>
                                </div>
                            </div>
                        )}

                        {data.tasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-time">
                                    <Clock size={14} />
                                    <span>{task.time}</span>
                                </div>
                                <div
                                    className="task-content-card"
                                    onClick={() => toggleTask(currentDate, task.id)}
                                    style={{ borderLeft: `4px solid ${getCategoryColor(task.category)}` }}
                                >
                                    <div className="task-main">
                                        {task.completed ? <CheckCircle size={18} className="icon-checked" /> : <Circle size={18} className="icon-unchecked" />}
                                        <span className={task.completed ? 'completed-text' : ''}>{task.title}</span>
                                    </div>
                                    {task.category && (
                                        <span className="task-tag" style={{ color: getCategoryColor(task.category), background: `${getCategoryColor(task.category)}15` }}>
                                            {task.category}
                                        </span>
                                    )}
                                </div>
                                <div className="task-actions-group" style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        className="icon-btn-secondary"
                                        title="Add to Google Calendar"
                                        onClick={() => addToGoogleCalendar(task, currentDate)}
                                    >
                                        <Calendar size={14} color="#6b7280" />
                                    </button>
                                    <button className="delete-btn-task" onClick={() => deleteTask(currentDate, task.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!isAddingTask && data.tasks.length === 0 && (
                            <div className="tasks-placeholder">
                                <p>No tasks scheduled for today</p>
                                <small>Click "Add Task" to get started</small>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="notes-column">
                    <h3>Notes</h3>
                    <div className="notes-editor">
                        <textarea
                            placeholder="Write your notes here..."
                            value={data.notes}
                            onChange={(e) => updateNotes(currentDate, e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyView;
