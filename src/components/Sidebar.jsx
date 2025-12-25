import React from 'react';
import { Home, Compass, Settings, Plus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="main-sidebar">
            <div className="sidebar-top">
                <button className="sidebar-icon-btn">
                    <Home size={20} />
                </button>
                <div className="divider"></div>
                <button className="sidebar-icon-btn active">
                    <Compass size={20} />
                </button>
            </div>

            <button className="new-tab-btn">
                <Plus size={16} />
            </button>
        </div>
    );
};

export default Sidebar;
