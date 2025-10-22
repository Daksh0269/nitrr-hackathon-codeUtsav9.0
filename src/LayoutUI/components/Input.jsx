import React, { useId } from 'react';

const Input = React.forwardRef(function ({
    label,
    type = 'text',
    className = '', 
    inputClassName = '', 
    ...props
}, ref) {
    const id = useId();

    const baseInputClasses = `
        w-full 
        bg-black 
        border 
        border-[#333333] 
        rounded-lg 
        px-4 
        py-3 
        text-white 
        placeholder-gray-500 
        text-base 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-600 
        focus:border-blue-600 
        transition-all 
        duration-200
    `;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label 
                    htmlFor={id} 
                    className="block text-sm font-medium text-gray-400 mb-1 sr-only"
                >
                    {label}
                </label>
            )}
            
            <input
                type={type}
                id={id}
                ref={ref}
                className={`${baseInputClasses} ${inputClassName}`}
                {...props}
            />
        </div>
    );
});

export default Input;