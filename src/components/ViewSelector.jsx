import { Calendar, Layout as LayoutIcon, CalendarDays, Flag, Settings, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './ViewSelector.css';

const ViewSelector = ({ currentView, onViewChange }) => {
    const { currentUser, logout } = useAuth();

    const views = [
        { id: 'daily', label: 'Daily', icon: LayoutIcon },
        { id: 'weekly', label: 'Weekly', icon: CalendarDays },
        { id: 'monthly', label: 'Monthly', icon: Calendar },
        { id: 'yearly', label: 'Yearly', icon: Flag },
        { id: 'categories', label: 'Categories', icon: Settings },
    ];

    return (
        <div className="view-selector" style={{ justifyContent: 'space-between', width: '100%', paddingRight: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                {views.map(view => {
                    const Icon = view.icon;
                    return (
                        <button
                            key={view.id}
                            className={`view-tab ${currentView === view.id ? 'active' : ''}`}
                            onClick={() => onViewChange(view.id)}
                        >
                            <Icon size={18} />
                            <span>{view.label}</span>
                        </button>
                    );
                })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="User" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            ) : (
                                <User size={20} />
                            )}
                            <span className="user-name-mobile-hidden">{currentUser.displayName?.split(' ')[0]}</span>
                        </div>
                        <button
                            onClick={logout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                border: 'none', background: '#fee2e2', color: '#ef4444',
                                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                            }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onViewChange('login')}
                        className={`view-tab ${currentView === 'login' ? 'active' : ''}`}
                        style={{ background: currentView === 'login' ? '#4f46e5' : '#e0e7ff', color: currentView === 'login' ? 'white' : '#4f46e5', border: 'none' }}
                    >
                        <LogIn size={18} />
                        <span>Log In</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ViewSelector;
