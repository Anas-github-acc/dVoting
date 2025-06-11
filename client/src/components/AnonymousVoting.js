import React, { useState, useEffect } from 'react';
import { 
  generateSalt, 
  commitVote, 
  revealVote, 
  getAnonymousVotingContract,
  getElectionOptions,
  getVoteCount
} from '../utils/anonymousVotingUtils';

const AnonymousVoting = ({ web3, account }) => {
  const [contract, setContract] = useState(null);
  const [electionId, setElectionId] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [salt, setSalt] = useState('');
  const [voteCounts, setVoteCounts] = useState({});
  const [isCommitPhase, setIsCommitPhase] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      if (web3) {
        const votingContract = await getAnonymousVotingContract(web3);
        setContract(votingContract);
        
        // Generate a random salt for the user
        setSalt(generateSalt());
        
        // Load election options
        try {
          const electionOptions = await getElectionOptions(votingContract, electionId);
          setOptions(electionOptions);
          
          // Get vote counts for each option
          const counts = {};
          for (const option of electionOptions) {
            counts[option] = await getVoteCount(votingContract, electionId, option);
          }
          setVoteCounts(counts);
          
          // Check if we're in commit phase
          const election = await votingContract.methods.elections(electionId).call();
          setIsCommitPhase(election.commitPhase);
        } catch (error) {
          console.error("Error loading election data:", error);
          setMessage("Error loading election data. Please try again.");
        }
      }
    };
    
    init();
  }, [web3, electionId]);

  const handleCommitVote = async () => {
    if (!selectedOption) {
      setMessage("Please select an option to vote for.");
      return;
    }
    
    setLoading(true);
    setMessage("Committing your vote...");
    
    try {
      await commitVote(web3, contract, electionId, selectedOption, salt, account);
      setMessage(`Vote committed successfully! Please save your salt: ${salt}`);
      
      // Store salt in localStorage for later reveal
      localStorage.setItem(`vote-salt-${electionId}`, salt);
      localStorage.setItem(`vote-option-${electionId}`, selectedOption);
    } catch (error) {
      console.error("Error committing vote:", error);
      setMessage("Error committing vote. Please try again.");
    }
    
    setLoading(false);
  };

  const handleRevealVote = async () => {
    // Try to get saved salt and option from localStorage
    const savedSalt = localStorage.getItem(`vote-salt-${electionId}`);
    const savedOption = localStorage.getItem(`vote-option-${electionId}`);
    
    const voteOption = savedOption || selectedOption;
    const voteSalt = savedSalt || salt;
    
    if (!voteOption || !voteSalt) {
      setMessage("Please provide your vote option and salt to reveal.");
      return;
    }
    
    setLoading(true);
    setMessage("Revealing your vote...");
    
    try {
      await revealVote(contract, electionId, voteOption, voteSalt, account);
      setMessage("Vote revealed successfully!");
      
      // Update vote counts
      const newCount = await getVoteCount(contract, electionId, voteOption);
      setVoteCounts(prev => ({...prev, [voteOption]: newCount}));
    } catch (error) {
      console.error("Error revealing vote:", error);
      setMessage("Error revealing vote. Please check your option and salt.");
    }
    
    setLoading(false);
  };

  return (
    <div className="anonymous-voting-container">
      <h2>Anonymous Voting</h2>
      
      <div className="election-selector">
        <label>Election ID:</label>
        <input 
          type="number" 
          value={electionId} 
          onChange={(e) => setElectionId(Number(e.target.value))} 
          min="0"
        />
      </div>
      
      <div className="phase-indicator">
        <p>Current Phase: {isCommitPhase ? "Commit Phase" : "Reveal Phase"}</p>
      </div>
      
      <div className="options-container">
        <h3>Vote Options:</h3>
        {options.length > 0 ? (
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="voteOption"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                  />
                  {option} {!isCommitPhase && `(Votes: ${voteCounts[option] || 0})`}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>No options available for this election.</p>
        )}
      </div>
      
      {isCommitPhase ? (
        <div className="commit-container">
          <p>Your salt (save this): <strong>{salt}</strong></p>
          <button 
            onClick={handleCommitVote} 
            disabled={loading || !selectedOption}
          >
            {loading ? "Processing..." : "Commit Vote"}
          </button>
        </div>
      ) : (
        <div className="reveal-container">
          <div className="salt-input">
            <label>Your Salt:</label>
            <input 
              type="text" 
              value={salt} 
              onChange={(e) => setSalt(e.target.value)} 
              placeholder="Enter your salt"
            />
          </div>
          <button 
            onClick={handleRevealVote} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Reveal Vote"}
          </button>
        </div>
      )}
      
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AnonymousVoting;