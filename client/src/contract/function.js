import Web3 from "web3";

const web3 = new Web3(window.ethereum); 
// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545/"));

async function createElection(contract, account, _eventName) {
    try {
        // console.log("createElection:", contract._address);
        let contract_address = contract._address;
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0];

        const nonce = await web3.eth.getTransactionCount(from_address);
        const gas = await web3.eth.getGasPrice();

        const txData = contract.methods.createElection(_eventName).encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gas,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        })

        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        // console.log('Emitted Events:', events);
        // console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg}
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }
}

async function getElections(contract, account) {
    try {
        let res = await contract.methods.getElections().call();
        console.log("Election Count :", res);
        return { error: false, message: res }
    } catch (error) {
        throw error;
    }
}

async function getElectionCount(contract, account) {
    try {
        let res = await contract.methods.getElectionCount().call();
        console.log("Election Count :", res);
        return { error: false, message: res }
    } catch (error) {
        throw error;
    }
}

async function registerCandidates(contract, account, _electionId, _name, _age, _candidateAddress) {
    try {
        console.log("registerCandidates:", contract._address);
        // Getting contract address
        let contract_address = contract._address

        // Getting account address from web3
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0]

        // Getting nonce value and gasPrice for the account
        const nonce = await web3.eth.getTransactionCount(from_address);
        const gasPrice = await web3.eth.getGasPrice();

        // Preparing txn obj
        const txData = contract.methods
            .registerCandidates(
                _electionId,
                _name,
                Number(_age),
                _candidateAddress
            )
            .encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        // sending txn 
        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        });

        // Getting events to check 
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        console.log('Emitted Events:', events);
        console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg }
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function verifyVoter(contract, account, _electionId, _voterAddress) {
    try {
        console.log("registerCandidates:", contract._address);
        // Getting contract address
        let contract_address = contract._address

        // Getting account address from web3
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0]

        // Getting nonce value and gasPrice for the account
        const nonce = await web3.eth.getTransactionCount(from_address);
        const gasPrice = await web3.eth.getGasPrice();

        // Preparing txn obj
        const txData = contract.methods.verifyVoter(_electionId, _voterAddress).encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        // sending txn 
        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        });

        // Getting events to check 
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        console.log('Emitted Events:', events);
        console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg }

    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function startVoting(contract, account, _electionId) {
    try {
        console.log("registerCandidates:", contract._address);
        // Getting contract address
        let contract_address = contract._address

        // Getting account address from web3
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0]

        // Getting nonce value and gasPrice for the account
        const nonce = await web3.eth.getTransactionCount(from_address);
        const gasPrice = await web3.eth.getGasPrice();

        // Preparing txn obj
        const txData = contract.methods.startVoting(_electionId).encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        // sending txn 
        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        });

        // Getting events to check 
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        console.log('Emitted Events:', events);
        console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg }

    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function stopVoting(contract, _electionId, account) {
    try {
        console.log("registerCandidates:", contract._address);
        // Getting contract address
        let contract_address = contract._address

        // Getting account address from web3
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0]

        // Getting nonce value and gasPrice for the account
        const nonce = await web3.eth.getTransactionCount(from_address);
        const gasPrice = await web3.eth.getGasPrice();

        // Preparing txn obj
        const txData = contract.methods.stopVoting(_electionId).encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        // sending txn 
        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        });

        // Getting events to check 
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        console.log('Emitted Events:', events);
        console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg }
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function votingStarted(contractInstance, account, _electionId) {
    try {
        let res2 = await contractInstance.methods.votingStatus(_electionId).call();
        console.log("Res:",res2);
        return {error: false, message: res2}
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function getWinner(contractInstance, account, _electionId,) {
    try {
        console.log("contract:",contractInstance.methods);
        let winnerAddress = await contractInstance.methods.winnerAddress(_electionId).call();
        let arrayPosition = await contractInstance.methods.candidates(winnerAddress).call();
        let winnerDetails = await contractInstance.methods.candidateList(arrayPosition).call();
        console.log("winnerAddress:", winnerAddress);
        console.log("arrayPosition:",arrayPosition);
        console.log("winnerDetails:",winnerDetails);
        return { error: false, message: { candidateAddress: winnerDetails.candidateAddress, age: winnerDetails.age, name: winnerDetails.name } }
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }
}

async function getAllCandidate(contractInstance, account, _electionId) {
    try {
        let candidateList = []
        let res2 = await contractInstance.methods.getAllCandidates(_electionId).call();

        for (let i = 1; i < res2.length; i++) {
            candidateList.push(res2[i])
        }

        console.log("listwww:", candidateList);
        return { error: false, message: candidateList }
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

async function setVote(contract, account, _electionId, _candidateAddress) {
    try {
        console.log("registerCandidates:", contract._address);
        // Getting contract address
        let contract_address = contract._address

        // Getting account address from web3
        let from_address = await web3.eth.getAccounts();
        from_address = from_address[0]

        // Getting nonce value and gasPrice for the account
        const nonce = await web3.eth.getTransactionCount(from_address);
        const gasPrice = await web3.eth.getGasPrice();

        // Preparing txn obj
        const txData = contract.methods.setVote(_electionId, _candidateAddress).encodeABI();

        const txObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: web3.utils.toHex(3000000),
            to: contract_address,
            data: txData,
        };

        // sending txn 
        const txReceipt = await web3.eth.sendTransaction({
            from: from_address,
            ...txObject
        });

        // Getting events to check 
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: txReceipt.blockNumber,
            toBlock: txReceipt.blockNumber,
        });

        console.log('Emitted Events:', events);
        console.log('Transaction Hash:', txReceipt);

        return { error: false, message: events[0].returnValues.msg }
    } catch (error) {
        console.log("Error:", error);
        return { error: true, message: error.message }
    }

}

export {
    createElection,
    getElections,
    getElectionCount,
    registerCandidates,
    verifyVoter,
    startVoting,
    stopVoting,
    votingStarted,
    getWinner,
    getAllCandidate,
    setVote
}