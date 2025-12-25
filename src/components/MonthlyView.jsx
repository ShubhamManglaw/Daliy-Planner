import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle, Circle } from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner';
import { DottedLineChart } from './Analytics/ProgressChart';
import './MonthlyView.css';

const MonthlyView = () => {
    // Current view states
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null); // { date: Date, data: Object }

    // We need usePlanner to get colors/stats
    const { getWeeklyStats, getCategoryColor, getCategories, getDateData } = usePlanner();
    const categories = getCategories();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Generate calendar grid
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    // Also build array for stats
    const monthDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
        monthDates.push(new Date(year, month, i));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    // Mock Stats
    // Calculate Stats
    const stats = monthDates.reduce((acc, date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayData = getDateData(dateStr) || { tasks: [] };

        const dayTotal = dayData.tasks.length;
        const dayCompleted = dayData.tasks.filter(t => t.completed).length;

        return {
            total: acc.total + dayTotal,
            completed: acc.completed + dayCompleted,
            pending: acc.pending + (dayTotal - dayCompleted)
        };
    }, { total: 0, completed: 0, pending: 0 });

    return (
        <div className="monthly-view">
            <div className="view-header">
                <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                <div className="date-display">
                    <h2>{monthNames[month]} {year}</h2>
                    <span className="subtitle">This Month</span>
                </div>
                <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
            </div>

            {/* Analytics Section */}
            <div className="monthly-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', height: '250px' }}>
                    <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#6b7280' }}>Monthly Activity Trends</h3>
                    <div style={{ height: 'calc(100% - 30px)', width: '100%' }}>
                        <DottedLineChart
                            data={getWeeklyStats(monthDates, 'day')}
                            categories={categories.map(cat => ({ name: cat.name, color: cat.color }))}
                        />
                    </div>
                </div>

                <div className="stats-cards-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="stat-card blue">
                        <h3>Total Tasks</h3>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card green">
                        <h3>Completed</h3>
                        <div className="stat-value">{stats.completed}</div>
                    </div>
                    <div className="stat-card orange">
                        <h3>Pending</h3>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                </div>
            </div>

            {/* Day Detail Modal */}
            {selectedDay && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setSelectedDay(null)}>
                    <div className="modal-content" style={{
                        background: 'white', padding: '24px', borderRadius: '16px',
                        width: '400px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                                {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <button onClick={() => setSelectedDay(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} color="#6b7280" />
                            </button>
                        </div>

                        <div className="day-tasks-list">
                            {(!selectedDay.data.tasks || selectedDay.data.tasks.length === 0) ? (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
                                    No tasks for this day
                                </div>
                            ) : (
                                selectedDay.data.tasks.map(task => (
                                    <div key={task.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px', borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        {task.completed ? <CheckCircle size={18} color="#10b981" /> : <Circle size={18} color="#d1d5db" />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', color: task.completed ? '#9ca3af' : '#1f2937', textDecoration: task.completed ? 'line-through' : 'none' }}>
                                                {task.title}
                                            </div>
                                            <div style={{ fontSize: '12px', color: getCategoryColor(task.category), marginTop: '4px' }}>
                                                {task.category}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <button onClick={() => setSelectedDay(null)} style={{
                                width: '100%', padding: '10px', background: '#f3f4f6', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#374151'
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar */}
            <div className="calendar-container">
                <div className="calendar-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="day-header">{day}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-cell ${day ? 'active-day' : ''}`}
                            onClick={() => {
                                if (day) {
                                    const d = new Date(year, month, day);
                                    const dStr = d.toISOString().split('T')[0];
                                    setSelectedDay({
                                        date: d,
                                        data: getDateData(dStr)
                                    });
                                }
                            }}
                            style={{ cursor: day ? 'pointer' : 'default' }}
                        >
                            {day && (
                                <>
                                    <span className="day-number">{day}</span>
                                    {/* Placeholder for tasks/dots */}
                                    {(() => {
                                        const d = new Date(year, month, day);
                                        const dStr = d.toISOString().split('T')[0];
                                        const dData = getDateData(dStr);
                                        const count = dData.tasks ? dData.tasks.length : 0;
                                        return count > 0 && (
                                            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                                                {/* Show up to 3 dots */}
                                                {[...Array(Math.min(count, 3))].map((_, i) => (
                                                    <div key={i} className="event-dot" style={{ background: '#3b82f6' }}></div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthlyView;
