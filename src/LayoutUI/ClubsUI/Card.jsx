import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function SimpleCard({ id, title, summary, tag }) {
    const navigate = useNavigate(); 

    const handleViewContent = () => {
        // FIX: Navigate to /clubs/:id instead of /content/:id
        navigate(`/clubs/${id}`);
    };

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5 
                    transition-all duration-300 hover:shadow-xl hover:border-blue-600 
                    flex flex-col h-full">

            {tag && (
                <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 
                                 px-2 py-0.5 rounded-full mb-2 self-start">
                    {tag}
                </span>
            )}

            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
            <p className="text-sm text-gray-400 flex-grow mb-4">{summary}</p>
            

            <div className="mt-auto pt-3">
                <Button
                    onClick={handleViewContent} 
                    variant="darkOutline" 
                    size="sm"
                    className="w-full"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}

export default SimpleCard;