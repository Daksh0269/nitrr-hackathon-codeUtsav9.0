import React from 'react';

/**
 * A responsive full-page grid wrapper for dynamic content cards.
 * It provides the main page container and the responsive grid layout logic.
 * * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The cards or content to be rendered inside the grid.
 * @param {string} [props.className] - Optional class names for the outer container.
 * @param {number} [props.minCardWidth=320] - The minimum width (in pixels) for each column.
 */
function GridPageWrapper({ children, className = '', minCardWidth = 320 }) {
    return (
        // Outer Container: Full width, dark background (matching the app's theme)
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