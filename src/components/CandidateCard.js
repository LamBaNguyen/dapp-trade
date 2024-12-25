import React from 'react';

const CandidateCard = ({ candidate }) => {
return (
    <div className="bg-white shadow-md rounded-md p-4">
        <h3 className="text-lg font-bold">{candidate.name}</h3>
        <p className="text-gray-700">{candidate.description}</p>
    </div>
    );
};

export default CandidateCard;