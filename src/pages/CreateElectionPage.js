import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import ElectionManagerABI from '../utils/ElectionManagerABI.json';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Alert from '../components/Alert';

const ElectionManagerAddress = '0xC5043349A44b486d902FF729662D0ABeB3b90E37';

const CreateElectionPage = () => {
  const { signer, account } = useWeb3();
  const navigate = useNavigate();
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
            const contract = new ethers.Contract(ElectionManagerAddress, ElectionManagerABI, signer);
            const transaction = await contract.createElection(
                data.name,
                data.description,
                Math.floor(new Date(data.startTime).getTime()/1000),
                Math.floor(new Date(data.endTime).getTime()/1000)
                );
            await transaction.wait();
             setAlert({ message: 'Election created successfully.', type: 'success' });
            navigate('/');
            } catch (error) {
                console.error("Error creating election:", error);
                setAlert({ message: `Error creating election: ${error.message}`, type: 'error' });
           }finally{
                setLoading(false);
           }
    };

   const validateDate = (value) => {
       if(!value){
           return 'This field is required';
       }
       try {
            const date = new Date(value);
            if (isNaN(date)) {
            return 'Invalid date format';
        }
         return true;
       }catch (e){
          return 'Invalid date format';
       }
   }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create New Election</h2>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Election Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter Election Name"
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
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                  Start Time
              </label>
              <input
                  type="datetime-local"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 {...register("startTime", { validate: validateDate })}
              />
               {errors.startTime && <p className="text-red-500 text-xs italic">{errors.startTime.message}</p>}
          </div>
           <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                  End Time
               </label>
              <input
                  type="datetime-local"
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   {...register("endTime", { validate: validateDate })}
              />
               {errors.endTime && <p className="text-red-500 text-xs italic">{errors.endTime.message}</p>}
          </div>
           <button
            type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               disabled={loading}
           >
            {loading ? 'Creating...' : 'Create Election'}
            </button>
         </form>
    </div>
  );
};

export default CreateElectionPage;