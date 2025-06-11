// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnonymousVoting {
    struct Election {
        string name;
        bool commitPhase; 
        mapping(address => bytes32) voteCommits;
        mapping(address => bool) hasRevealed;
        mapping(bytes32 => uint256) voteCounts;
        string[] options;
        uint256 totalVotes;
    }

    address public admin;
    uint256 public electionCount;
    mapping(uint256 => Election) public elections;

    event ElectionCreated(uint256 indexed electionId, string name, string[] options);
    event CommitPhaseStarted(uint256 indexed electionId);
    event RevealPhaseStarted(uint256 indexed electionId);
    event VoteCommitted(uint256 indexed electionId, address indexed voter);
    event VoteRevealed(uint256 indexed electionId, address indexed voter, string voteOption);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(string memory _name, string[] memory _options) external onlyAdmin {
        Election storage e = elections[electionCount];
        e.name = _name;
        e.options = _options;
        e.commitPhase = true;
        emit ElectionCreated(electionCount, _name, _options);
        electionCount++;
    }

    function startRevealPhase(uint256 _electionId) external onlyAdmin {
        Election storage e = elections[_electionId];
        require(e.commitPhase, "Already in reveal phase");
        e.commitPhase = false;
        emit RevealPhaseStarted(_electionId);
    }

    function commitVote(uint256 _electionId, bytes32 _voteCommit) external {
        Election storage e = elections[_electionId];
        require(e.commitPhase, "Not in commit phase");
        require(e.voteCommits[msg.sender] == 0, "Already committed");
        e.voteCommits[msg.sender] = _voteCommit;
        emit VoteCommitted(_electionId, msg.sender);
    }

    function revealVote(uint256 _electionId, string memory _voteOption, string memory _salt) external {
        Election storage e = elections[_electionId];
        require(!e.commitPhase, "Not in reveal phase");
        require(e.voteCommits[msg.sender] != 0, "No commit found");
        require(!e.hasRevealed[msg.sender], "Already revealed");

        bytes32 computedCommit = keccak256(abi.encodePacked(_voteOption, _salt));
        require(computedCommit == e.voteCommits[msg.sender], "Commitment mismatch");

        bytes32 optionHash = keccak256(abi.encodePacked(_voteOption));
        e.voteCounts[optionHash]++;
        e.hasRevealed[msg.sender] = true;
        e.totalVotes++;
        emit VoteRevealed(_electionId, msg.sender, _voteOption);
    }

    function getVoteCount(uint256 _electionId, string memory _voteOption) external view returns (uint256) {
        Election storage e = elections[_electionId];
        return e.voteCounts[keccak256(abi.encodePacked(_voteOption))];
    }

    function getElectionOptions(uint256 _electionId) external view returns (string[] memory) {
        return elections[_electionId].options;
    }
}