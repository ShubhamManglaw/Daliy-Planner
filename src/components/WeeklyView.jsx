import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner';
import { DottedLineChart } from './Analytics/ProgressChart';
import './WeeklyView.css';

const WeeklyView = () => {
    // Current view states
    const [currentDate, setCurrentDate] = useState(new Date());

    const { getDateData, getCategoryColor, getWeeklyStats, getCategories } = usePlanner();
    const categories = getCategories();

    // ... (rest of getWeekDays)

    const getWeekDays = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];

    const weekTitle = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };


    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="weekly-view">
            <div className="view-header">
                <button className="nav-btn" onClick={prevWeek}><ChevronLeft size={20} /></button>
                <div className="date-display">
                    <h2>{weekTitle}</h2>
                    <span className="subtitle">Weekly Overview</span>
                </div>
                <button className="nav-btn" onClick={nextWeek}><ChevronRight size={20} /></button>
            </div>

            {/* Analytics Section - Fixed Height container to prevent overflow */}
            <div className="weekly-stats-section" style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', height: '300px', flexShrink: 0 }}>
                <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#6b7280' }}>Weekly Activity Trends</h3>
                <div style={{ height: 'calc(100% - 30px)', width: '100%' }}>
                    <DottedLineChart
                        data={getWeeklyStats(weekDays)}
                        categories={categories.map(cat => ({ name: cat.name, color: cat.color }))}
                    />
                </div>
            </div>

            <div className="week-grid">
                {weekDays.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const dayData = getDateData(dateString);
                    const hasTasks = dayData.tasks.length > 0;
                    const completedTasks = dayData.tasks.filter(t => t.completed).length;

                    return (
                        <div key={index} className="day-column">
                            <div className={`day-column-header ${date.toDateString() === new Date().toDateString() ? 'is-today' : ''}`}>
                                <span className="day-name">{dayNames[index]}</span>
                                <span className="day-date">{date.getDate()}</span>
                            </div>
                            <div className="day-column-content">
                                {hasTasks ? (
                                    <div className="day-summary">
                                        <div className="task-count">
                                            {completedTasks}/{dayData.tasks.length} tasks
                                        </div>
                                        {dayData.tasks.map(t => (
                                            <div key={t.id} className={`mini-task ${t.completed ? 'done' : ''}`} style={{ borderLeftColor: getCategoryColor(t.category) }}>
                                                {t.title}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-slot-marker"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyView;
