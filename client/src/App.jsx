import { useState, useEffect } from 'react'
import './App.css'
import abi from "./contract/Decentragram.json"
import Navbar from './components/Navbar'
import Main from './components/Main'
import { ethers } from 'ethers'

function App() {
  const [state,setState] = useState({
    provider:"",
    signer:"",
    contract:"",
    address:""
  })
  const [account ,setAccount]=useState("")

  useEffect(() => {
    const connectWallet = async () => {
      window.ethereum.on("chainChanged", ()=>{
        window.location.reload()
      })
      window.ethereum.on("accountsChanged", ()=>{
        window.location.reload()
      })
      const contractAddress = "0x65491F47F19A02f477409CAc3a41c7D1AEcc77e5";
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        if (!ethereum) {
          console.log("Metamask is not installed");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length === 0) {
          console.log("No account found");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress()
        setAccount(address)
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log(signer)

        setState({ provider, signer, contract,address });
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    };

    connectWallet();
  }, []);




  return (
    <>
    <Navbar account={account}/>
    <Main state={state} account={account}/>
    
      
    </>
  )
}

export default App
