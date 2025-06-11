import React, {useState, useEffect} from 'react';
import './App.css';
import VoterComponent from './components/voter_component.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminComponent from './components/admin_component.js';
// import {connectWeb3Metamask} from './contract/web3_functions.js';
import getWeb3 from './utils/web3.js';
import detectEthereumProvider from '@metamask/detect-provider';
import AnonymousVoting from './components/AnonymousVoting';

function App() {

  const [contractInstance, setContract] = useState(null)
  const [accounts, setAccounts] = useState()

  useEffect(()=>{ 
    async function connect(){
      // const web3 = new getWeb3();
      // const { accounts, instance } = await web3.connectWeb3();
      // setAccounts(accounts);
      // setContract(instance);
      const provider = await detectEthereumProvider();
      try {
        if (provider) {
          console.log("Metamask found");
          const web3 = new getWeb3(provider);
          const { accounts, instance } = await web3.connectWeb3WithMetaMask();
          setAccounts(accounts);
          setContract(instance);
          // console.log( "--> " ,instance.methods);
        } else {
          alert(
            `Metamask not found. Install metamask!!`
          )
        }
      } catch (error) {
        // -32002 error code means metamask is trying to take permission
        if(error.code !== -32002){
          // alert(
          //   `Failed to load web3, accounts, or contract. Check console for details.`,
          // );
        }
        console.log(" -->", error);
      }
    }
    setTimeout(connect, 1500);
  },[])

  return (
    <div className="App">
       { contractInstance == null ? 
        <>
          <h2 style={{textAlign: "center"}}> Loading Application </h2>
        </> :
        <>
          <BrowserRouter>
            <Routes>
              <Route index element={<AdminComponent contractInstance={contractInstance} account={accounts[0]} />}/>
              <Route path="/voting" element={<VoterComponent  contractInstance={contractInstance} account={accounts[0]} />}/>
            </Routes>
          </BrowserRouter>
        </>}
    </div>
  );
}

export default App;

