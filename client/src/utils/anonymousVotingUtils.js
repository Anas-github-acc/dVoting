import Web3 from 'web3';
import AnonymousVotingContract from '../contracts/AnonymousVoting.json';


export const generateSalt = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createVoteCommitment = (web3, voteOption, salt) => {
  return web3.utils.soliditySha3(
    {type: 'string', value: voteOption},
    {type: 'string', value: salt}
  );
};

export const commitVote = async (web3, contract, electionId, voteOption, salt, account) => {
  const commitment = createVoteCommitment(web3, voteOption, salt);
  
  return await contract.methods.commitVote(electionId, commitment)
    .send({ from: account });
};

export const revealVote = async (contract, electionId, voteOption, salt, account) => {
  return await contract.methods.revealVote(electionId, voteOption, salt)
    .send({ from: account });
};

export const getAnonymousVotingContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = AnonymousVotingContract.networks[networkId];
  
  return new web3.eth.Contract(
    AnonymousVotingContract.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export const getElectionOptions = async (contract, electionId) => {
  return await contract.methods.getElectionOptions(electionId).call();
};

export const getVoteCount = async (contract, electionId, option) => {
  return await contract.methods.getVoteCount(electionId, option).call();
};