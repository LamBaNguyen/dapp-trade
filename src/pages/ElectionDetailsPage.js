import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import ElectionManagerABI from '../utils/ElectionManagerABI.json';
import CandidateManagerABI from '../utils/CandidateManagerABI.json';
import VotingABI from '../utils/VotingABI.json';
import CandidateCard from '../components/CandidateCard';
import Alert from '../components/Alert';

const ElectionManagerAddress = '0xC5043349A44b486d902FF729662D0ABeB3b90E37';
const CandidateManagerAddress = '0xF9C42657a5a8b71F7f56402fA8e34427fD5C632A';
const VotingAddress = '0xD3Cbc88e879d94eFcBE9cf6AFA62afe2fDA11b14';

const ElectionDetailsPage = () => {
    const { electionId } = useParams();
    const { provider, signer, account } = useWeb3();

    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votingLoading, setVotingLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount] = useState({});
    const [alert, setAlert] = useState({ message: '', type: '' });

    const isAdmin = (election) => {
      return election?.admin?.toLowerCase() === account?.toLowerCase();
    };
    useEffect(() => {
        const fetchElectionData = async () => {
          if (provider) {
             try {
                const electionManagerContract = new ethers.Contract(ElectionManagerAddress, ElectionManagerABI, provider);
                const electionData = await electionManagerContract.getElection(electionId);
                const admin = await electionManagerContract.admin();
                setElection({
                   id: electionData[0].toString(),
                   name: electionData[1],
                   description: electionData[2],
                   startTime: new Date(Number(electionData[3]) * 1000),
                   endTime: new Date(Number(electionData[4]) * 1000),
                   isActive: electionData[5],
                   admin: admin
                });
               const candidateManagerContract = new ethers.Contract(CandidateManagerAddress, CandidateManagerABI, provider);
               const candidateIds = await candidateManagerContract.getCandidates(electionId);
               const candidatePromises = candidateIds.map(id => candidateManagerContract.getCandidate(electionId, id));
               const candidateData = await Promise.all(candidatePromises);
               const candidates = candidateData.map(candidate => {
                  return {
                   id: candidate[0].toString(),
                   name: candidate[1],
                   description: candidate[2]
                   }
               });
               setCandidates(candidates);
              }catch (error) {
                    console.error('Error fetching election data:', error);
               } finally {
                    setLoading(false);
               }
          }
        };
       fetchElectionData();
    }, [electionId, provider]);

    useEffect(() => {
        const fetchVoteData = async () => {
          if (provider && account && election) {
             try{
                const votingContract = new ethers.Contract(VotingAddress, VotingABI, provider);
                 const voted = await votingContract.hasVoted(electionId, account);
                 setHasVoted(voted);
                const voteCountPromises = candidates.map(candidate => votingContract.getVoteCount(electionId, candidate.id))
                const voteCountData = await Promise.all(voteCountPromises);

                const counts = {};
                candidates.forEach((candidate, index) => {
                  counts[candidate.id] = Number(voteCountData[index].toString());
                 });
                setVoteCount(counts)
             } catch (error) {
                  console.error("Error fetching vote data:", error);
                }
          }
         }
         fetchVoteData()
     }, [provider, account, election, candidates, hasVoted]);

    const handleVote = async (candidateId) => {
        if (!signer) {
          setAlert({ message: 'Please connect your wallet.', type: 'error' });
            return;
          }
       if(hasVoted) {
          setAlert({ message: 'You have already voted.', type: 'error' });
          return;
       }
        try {
            setVotingLoading(true);
            const votingContract = new ethers.Contract(VotingAddress, VotingABI, signer);
            const transaction = await votingContract.vote(electionId, candidateId);
            await transaction.wait();
             setHasVoted(true);
             setAlert({ message: 'Vote submitted successfully.', type: 'success' });
        } catch (error) {
            console.error("Error voting:", error);
            setAlert({ message: `Error voting: ${error.message}`, type: 'error' });
        } finally {
            setVotingLoading(false);
         }
     };
   const endElection = async () => {
        if(!signer) {
          setAlert({ message: 'Please connect your wallet.', type: 'error' });
          return;
        }
         try{
            const electionManagerContract = new ethers.Contract(ElectionManagerAddress, ElectionManagerABI, signer);
            const transaction = await electionManagerContract.endElection(electionId);
            await transaction.wait();
            setElection({...election, isActive: false})
             setAlert({ message: 'Election ended successfully.', type: 'success' });

         }catch(error) {
             console.error("Error end election:", error);
            setAlert({ message: `Error end election: ${error.message}`, type: 'error' });
         }

     }
    return (
        <div>
          {alert.message && <Alert message={alert.message} type={alert.type} />}

          {loading ? <p>Loading...</p> : election ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{election.name}</h2>
              <p className="text-gray-700 mb-2">{election.description}</p>
              <p className="text-gray-700 mb-2">Start Time: {election.startTime.toString()}</p>
              <p className="text-gray-700 mb-2">End Time: {election.endTime.toString()}</p>
              <p className="text-gray-700 mb-2">Status: {election.isActive ? "Active" : "Finished"}</p>

            <h3 className="text-xl font-bold mb-2">Candidates</h3>
            {candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white shadow-md rounded-md p-4">
                        <CandidateCard  candidate={candidate}/>
                     { election.isActive && !hasVoted ? (
                          <button
                            className="mt-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleVote(candidate.id)}
                            disabled={votingLoading}
                            >
                             {votingLoading ? 'Voting...' : 'Vote'}
                            </button>
                         ):
                       !election.isActive ? <p>Vote count: {voteCount[candidate.id] || 0}</p> : null
                    }
                    </div>
                 ))}
                </div>

              ) : (
                <p>No candidates added yet.</p>
              )}


              {isAdmin(election) && (
                 <div className="mt-8">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={endElection}>
                   End election
                  </button>
                 <Link to={`/election/${electionId}/add-candidate`} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add Candidate
                  </Link>
               </div>
              )}
            </div>
            ) : (
               <p>Election not found.</p>
          )}
        </div>
      );
};

export default ElectionDetailsPage;