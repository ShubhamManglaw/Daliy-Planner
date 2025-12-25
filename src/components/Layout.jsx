import React from 'react';
import './Layout.css';

const Layout = ({ sidebar, topBar, children }) => {
    return (
        <div className="layout">
            <aside className="layout-sidebar">
                {sidebar}
            </aside>
            <div className="layout-content-wrapper">
                <header className="layout-topbar">
                    <div className="topbar-left">
                        {/* Can add breadcrumbs or title here if needed */}
                    </div>
                    <div className="topbar-center">
                        {topBar}
                    </div>
                    <div className="topbar-right">
                        {/* Profile or other actions */}
                    </div>
                </header>
                <main className="layout-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
