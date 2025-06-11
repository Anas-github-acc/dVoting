import React, {useState} from 'react';
import { TextField } from '@mui/material';
// import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
import {createElection, getElections, getElectionCount, registerCandidates, verifyVoter, getAllCandidate, getWinner, startVoting, stopVoting} from '../contract/function.js'

// const errorMsg = (
//     <Alert severity="error">
//         <AlertTitle>Error</AlertTitle>
//         This is an error alert — <strong>check it out!</strong>
//     </Alert>
// )


function AdminComponent({account, contractInstance}) {
    const [electionId, setElectionId] = useState();
    const [electionName, setElectionName] = useState();
    const [electionsList, setElectionsList] = useState();
    const [electionCount, setElectionCount] = useState(0);
    const [candidateName, setCandidateName] = useState();
    const [candidateAge, setCandidateAge] = useState();
    const [candidateAddress, setCandidatAddress] = useState();
    const [voterAddress, setVoterAddress] = useState();
    const [winnerAddress, setWinnerAddress] = useState();
    const [allCandidate, setAllCandidate] = useState();

    async function create_election(){
        console.log("name:", electionName);
        let result = await createElection(contractInstance, account, electionName);
        console.log("result:", result);
    }

    async function get_elections() {
        let result = await getElections(contractInstance, account);
        for (let i = 0; i < result.length; i++) {
            setElectionsList(result[i].name);
        }
        console.log("electionCount:", result);
    }

    async function election_count() {
        let result = await getElectionCount(contractInstance, account);
        setElectionCount(result.message.toString());
        console.log("electionCount:", result);
    }

    async function get_all_candidate(){
        console.log("name:", candidateName);
        let result = await getAllCandidate(contractInstance, account, electionId);
        console.log("result:", result);
        setAllCandidate(result);
    }

    async function register_candidate(){
        console.log("name:", candidateName);
        let result = await registerCandidates(contractInstance, account, electionId, candidateName, candidateAge, candidateAddress);
        console.log("result:", result);
    }

    
    async function register_voter(){
        console.log("name:", candidateName);
        let result = await verifyVoter(contractInstance, account, electionId, voterAddress);
        console.log("result:", result);
    }

    
    async function start_voting(){
        console.log("name:", candidateName);
        let result = await startVoting(contractInstance, account, electionId);
        console.log("result:", result);
    }

    
    async function stop_voting(){
        console.log("name:", candidateName);
        let result = await stopVoting(contractInstance, account, electionId);
        console.log("result:", result);
    }

    
    async function get_Winner(){
        console.log("name:", candidateName);
        let {message} = await getWinner(contractInstance, account, electionId);
        console.log("result:", message);
        setWinnerAddress(message.name)
    }

    return(
        <div style={{paddingTop: "18px", paddingLeft: "5%", paddingRight: "5%" }}>
            <div className='banner-area'style={{marginBottom: 20}} >
                <h1>WELCOME TO COLLEGE PRESIDENT ELECTION</h1>
            </div>
            <div >
                <div style={{float:"left", marginRight: 100}}>
                    <Card sx={{ width: 400 }}>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2} style={{marginTop: '10px'}}>
                            Create Election
                        </Typography>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Name" variant="outlined" style={{width: '100%'}} 
                                onChange={(e) => setElectionName(e.target.value)}/>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={create_election}>Create Election</Button>
                        </CardActions>
                        {/* <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%'}}
                            onChange={(e)=>setElectionId(e.target.value)}/>
                            </CardContent> */}
                        <CardActions>
                            <Button variant="contained" onClick={election_count}>Get Election Count</Button>
                        </CardActions>
                        <Typography gutterBottom variant="h6" component="div" align='left' paddingLeft={2}>
                            Election Count : {electionCount}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            {electionsList}
                        </Typography>
                        <CardActions>
                            <Button disabled variant="contained" onClick={get_elections}>Get Elections</Button>
                        </CardActions>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            {electionsList}
                        </Typography>
                    </Card>

                    <Card sx={{ width: 400 }}>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2} style={{marginTop: '10px'}}>
                            Register Candidate
                        </Typography>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setElectionId(e.target.value)}/>
                            <TextField id="outlined-basic" label="Candidate name" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setCandidateName(e.target.value)}/>
                            <TextField id="outlined-basic" label="Candidate Ag" variant="outlined" style={{width: '100%',marginBottom: '10px'}}
                                onChange={(e)=>setCandidateAge(e.target.value)}/>
                            <TextField id="outlined-basic" label="Candidate Address" variant="outlined" style={{width: '100%'}}
                                onChange={(e)=>setCandidatAddress(e.target.value)}/>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={register_candidate}>Register Candidate</Button>
                        </CardActions>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            {allCandidate}
                        </Typography>
                        <CardActions>
                            <Button variant="contained" onClick={get_all_candidate}>Get All Candidate</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{ maxWidth: 400, marginTop: 5, marginBottom: 5}}>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2} style={{marginTop: '10px'}}>
                            Register Voter
                        </Typography>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setElectionId(e.target.value)}/>
                            <TextField id="outlined-basic" label="Voter Address" variant="outlined" style={{width: '100%'}}
                                onChange={(e)=>setVoterAddress(e.target.value)}/>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={register_voter}>Register Voter</Button>
                        </CardActions>
                    </Card>
                </div>
                <div>
                    <Card sx={{ width: 400}}>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            Start Voting
                        </Typography>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setElectionId(e.target.value)}/>
                        </CardContent>
                        <CardActions align="middle">
                            <Button variant="contained" onClick={start_voting}>Start Voting</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{ maxWidth: 400, marginTop: 5}}>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            Stop Voting
                        </Typography>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setElectionId(e.target.value)}/>
                            </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={stop_voting}>Stop Voting</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{ maxWidth: 400, marginTop: 5}}>
                        <CardContent>
                            <TextField id="outlined-basic" label="Election Id" variant="outlined" style={{width: '100%', marginBottom: '10px'}}
                                onChange={(e)=>setElectionId(e.target.value)}/>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={get_Winner}>Get Wineer</Button>
                        </CardActions>
                        <Typography gutterBottom variant="h5" component="div" align='left' paddingLeft={2}>
                            {winnerAddress}
                        </Typography>
                    </Card>
                </div>
                
            </div>
      </div>
    )
}

export default AdminComponent