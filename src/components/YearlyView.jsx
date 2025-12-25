
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle, Circle, TrendingUp, X } from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner';
import { StackedBarChart } from './Analytics/ProgressChart';
import './YearlyView.css';

const YearlyView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null); // { name: string, index: number, stats: object }
    const year = currentDate.getFullYear();

    const { getYearlyGoals, addYearlyGoal, toggleYearlyGoal, deleteYearlyGoal, getYearlyStats, getCategoryColor, getCategories } = usePlanner();
    const goals = getYearlyGoals(year);
    const categories = getCategories();

    const [isAdding, setIsAdding] = useState(false);
    const [newGoalText, setNewGoalText] = useState('');

    const handleAddGoal = () => {
        if (!newGoalText.trim()) return;
        addYearlyGoal(year, newGoalText);
        setNewGoalText('');
        setIsAdding(false);
    };

    const completedGoals = goals.filter(g => g.completed).length;
    const progress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    return (
        <div className="yearly-view">
            <div className="view-header">
                <button className="nav-btn" onClick={() => setCurrentDate(new Date(year - 1, 0, 1))}><ChevronLeft size={20} /></button>
                <div className="date-display">
                    <h2>{year}</h2>
                    <span className="subtitle">This Year</span>
                </div>
                <button className="nav-btn" onClick={() => setCurrentDate(new Date(year + 1, 0, 1))}><ChevronRight size={20} /></button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid-year">
                <div className="stat-card blue-gradient">
                    <div className="stat-meta">
                        <h3>Total Tasks</h3>
                        {/* Placeholder aggregation */}
                        <span className="stat-number">-</span>
                    </div>
                    <TrendingUp size={24} className="stat-icon" />
                </div>
                <div className="stat-card green-gradient">
                    <div className="stat-meta">
                        <h3>Completed</h3>
                        <span className="stat-number">-</span>
                    </div>
                    <span className="stat-percentage">Target met</span>
                </div>
                <div className="stat-card purple-gradient">
                    <div className="stat-meta">
                        <h3>Yearly Goals</h3>
                        <span className="stat-number">{goals.length}</span>
                    </div>
                    <span className="stat-percentage">{completedGoals} done</span>
                </div>
            </div>

            {/* Yearly Chart */}
            <div className="yearly-chart-section" style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ marginBottom: '16px', fontWeight: '600', color: '#374151' }}>Yearly Performance by Category</h3>
                <StackedBarChart
                    data={getYearlyStats(year)}
                    categories={categories.map(cat => ({ name: cat.name, color: cat.color }))}
                />
            </div>

            {/* Goals List */}
            <div className="yearly-goals-section">
                <div className="section-header-year">
                    <h3>Yearly Goals {year}</h3>
                    <button className="primary-btn-small" onClick={() => setIsAdding(true)}>
                        <Plus size={14} /> Add Goal
                    </button>
                </div>

                {isAdding && (
                    <div className="new-goal-input-year">
                        <input
                            autoFocus
                            type="text"
                            placeholder="What do you want to achieve this year?"
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                        />
                        <div className="input-actions">
                            <button onClick={() => setIsAdding(false)}>Cancel</button>
                            <button className="primary-btn" onClick={handleAddGoal}>Add</button>
                        </div>
                    </div>
                )}

                <div className="goals-grid-display">
                    {goals.length === 0 && !isAdding && (
                        <div className="no-goals-message">
                            No yearly goals set yet. Start planning your year!
                        </div>
                    )}

                    {goals.map(goal => (
                        <div key={goal.id} className={`year - goal - card ${goal.completed ? 'completed' : ''} `} onClick={() => toggleYearlyGoal(year, goal.id)}>
                            <div className="goal-check">
                                {goal.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </div>
                            <span className="goal-text">{goal.text}</span>
                            <button className="delete-btn-year" onClick={(e) => { e.stopPropagation(); deleteYearlyGoal(year, goal.id); }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Month Detail Modal */}
            {selectedMonth && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setSelectedMonth(null)}>
                    <div className="modal-content" style={{
                        background: 'white', padding: '24px', borderRadius: '16px',
                        width: '500px', maxWidth: '90%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                                {selectedMonth.name} {year}
                            </h3>
                            <button onClick={() => setSelectedMonth(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} color="#6b7280" />
                            </button>
                        </div>

                        {/* Progress Bar Style */}
                        <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#1e3a8a', fontWeight: '500' }}>
                                <span>Month Progress</span>
                                <span>{selectedMonth.completed} / {selectedMonth.total} tasks</span>
                            </div>
                            <div style={{ height: '8px', background: '#dbeafe', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${selectedMonth.total > 0 ? (selectedMonth.completed / selectedMonth.total) * 100 : 0}%`,
                                    background: '#3b82f6', height: '100%', borderRadius: '4px',
                                    transition: 'width 0.5s ease'
                                }}></div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#6b7280' }}>
                            {selectedMonth.total === 0 ? "No tasks for this month" : "Keep up the good work!"}
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <button onClick={() => setSelectedMonth(null)} style={{
                                width: '100%', padding: '10px', background: '#f3f4f6', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#374151'
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Overview Grid */}
            <div className="months-grid-overview" style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '16px', fontWeight: '600', color: '#374151' }}>Monthly Overview</h3>
                <div className="months-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {getYearlyStats(year).map((monthStat, index) => {
                        // Calculate totals from the stats object we just got
                        // keys are 'name' + categories
                        let total = 0;
                        let completed = 0; // We might not have completed count in YearlyStats easily unless we update getYearlyStats schema, 
                        // actually getYearlyStats currently returns { name: 'Jan', Study: 5, Work: 3 } (counts of completed usually? Wait let's check definition)

                        // Checking getYearlyStats in usePlanner:
                        // It iterates days, checks if task.completed, adds to category count.
                        // So the numbers ARE completed tasks. Total tasks isn't strictly tracked there but we can sum values.

                        Object.keys(monthStat).forEach(key => {
                            if (key !== 'name') total += monthStat[key];
                        });

                        return (
                            <div key={monthStat.name} className="mini-month-card"
                                onClick={() => setSelectedMonth({
                                    name: monthStat.name,
                                    index,
                                    total: total, // This is actually completed tasks count based on current getYearlyStats
                                    completed: total // Since getYearlyStats counts completed, let's just show "Tasks Done"
                                })}
                                style={{
                                    background: 'white', padding: '16px', borderRadius: '12px',
                                    border: '1px solid #e5e7eb', cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>{monthStat.name}</h4>
                                <span className="mini-stat" style={{ fontSize: '13px', color: '#6b7280' }}>
                                    {total} tasks done
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default YearlyView;
