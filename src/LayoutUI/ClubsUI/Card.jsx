import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../components/Button';

/**
 * A simple card component matching the dark theme, now with navigation.
 * @param {object} props - Component props.
 * @param {string} props.id - The unique ID of the content (used for navigation).
 * @param {string} props.title - The card title.
 * @param {string} props.summary - A short description/summary.
 * @param {string} [props.tag] - An optional category or tag (e.g., "Technology").
 */
function SimpleCard({ id, title, summary, tag }) {
    const navigate = useNavigate(); // Initialize the hook

    const handleViewContent = () => {
        // Use the navigate function to go to the detail page route, 
        // dynamically inserting the content ID.
        navigate(`/content/${id}`);
    };

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5 
                    transition-all duration-300 hover:shadow-xl hover:border-blue-600 
                    flex flex-col h-full">

            {/* Tag/Category */}
            {tag && (
                <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 
                                 px-2 py-0.5 rounded-full mb-2 self-start">
                    {tag}
                </span>
            )}

            {/* Title and Summary */}
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
            <p className="text-sm text-gray-400 flex-grow mb-4">{summary}</p>
            
            {/* Action Button */}
            <div className="mt-auto pt-3">
                <Button
                    onClick={handleViewContent} // Attach the navigation handler
                    variant="darkOutline" 
                    size="sm"
                    className="w-full"
                >
                    View Content
                </Button>
            </div>
        </div>
    );
}

export default SimpleCard;