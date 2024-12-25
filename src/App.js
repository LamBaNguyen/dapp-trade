import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import CreateElectionPage from './pages/CreateElectionPage';
import AddCandidatePage from './pages/AddCandidatePage';
import { Web3Provider } from './contexts/Web3Context';

const App = () => {
  return (
     <Web3Provider>
       <Router>
            <Header/>
            <div className="container mx-auto p-4">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/election/:electionId" element={<ElectionDetailsPage />} />
                <Route path="/create" element={<CreateElectionPage />} />
                 <Route path="/election/:electionId/add-candidate" element={<AddCandidatePage />} />
                </Routes>
            </div>
        </Router>
    </Web3Provider>
  );
};

export default App;