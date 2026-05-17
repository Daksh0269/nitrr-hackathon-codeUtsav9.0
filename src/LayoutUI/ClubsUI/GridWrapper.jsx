import React from 'react';


function GridPageWrapper({ children, className = '', minCardWidth = 320 }) {
    return (
        
        <div className={`bg-black py-12 min-h-screen ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                    className="grid gap-6"
                    style={{
                        // ⭐️ Key to Responsiveness: Uses CSS Grid 'auto-fit' 
                        // to create as many columns as possible with a minimum width.
                        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export default GridPageWrapper;