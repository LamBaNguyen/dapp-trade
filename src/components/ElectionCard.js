import React from 'react';
import { Link } from 'react-router-dom';
const ElectionCard = ({ election }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-bold">{election.name}</h3>
      <p className="text-gray-700">{election.description.substring(0, 100)}...</p>
       <Link to={`/election/${election.id}`} className="mt-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         Xem chi tiết
       </Link>
    </div>
  );
};

export default ElectionCard;