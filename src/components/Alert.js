import React, { useState, useEffect } from 'react';

const Alert = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3000 milliseconds (3 seconds)
      return () => clearTimeout(timer); // Clear timer nếu component unmount
    }
  }, [message]);

  if (!message || !isVisible) return null;

  const alertColor =
    type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';

  return (
    <div className={`${alertColor} border-l-4 border-green-500 py-2 px-3 rounded-md mb-4`}>
      {message}
    </div>
  );
};

export default Alert;