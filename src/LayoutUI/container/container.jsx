import React from 'react'

const container = () => {
   return (
    <div
      className="
        w-full px-4 sm:px-6 lg:px-8 py-6 
        bg-white border border-gray-200 rounded-lg shadow-sm
      "
    >
      {children}
    </div>
  );
}

export default container