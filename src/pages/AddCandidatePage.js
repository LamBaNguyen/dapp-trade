import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import CandidateManagerABI from '../utils/CandidateManagerABI.json';
 import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Alert from '../components/Alert';

const CandidateManagerAddress = '0xF9C42657a5a8b71F7f56402fA8e34427fD5C632A';
const AddCandidatePage = () => {
  const { signer } = useWeb3();
  const navigate = useNavigate();
  const { electionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
    const { register, handleSubmit, formState: { errors } } = useForm();

   const onSubmit = async (data) => {
        if (!signer) {
            setAlert({ message: 'Please connect your wallet.', type: 'error' });
            return;
        }
      try {
            setLoading(true);
            const contract = new ethers.Contract(CandidateManagerAddress, CandidateManagerABI, signer);
            const transaction = await contract.addCandidate(
              electionId,
                data.name,
                data.description
                );
            await transaction.wait();
              setAlert({ message: 'Candidate created successfully.', type: 'success' });
              navigate(`/election/${electionId}`);
            } catch (error) {
                console.error("Error creating candidate:", error);
               setAlert({ message: `Error creating candidate: ${error.message}`, type: 'error' });
            }finally {
                setLoading(false);
             }
     };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>
       {alert.message && <Alert message={alert.message} type={alert.type} />}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Candidate Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter Candidate Name"
              {...register("name", { required: true })}
            />
             {errors.name && <p className="text-red-500 text-xs italic">This field is required</p>}
          </div>
          <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
             <textarea
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="Enter Description"
                 {...register("description", { required: true })}
            />
               {errors.description && <p className="text-red-500 text-xs italic">This field is required</p>}
         </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
           >
            {loading ? 'Adding...' : 'Add Candidate'}
          </button>
         </form>
    </div>
  );
};

export default AddCandidatePage;