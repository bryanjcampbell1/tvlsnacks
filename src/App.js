import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import web3Modal from "./WalletModal";
import {Button, Container} from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu';
import firebase from './firebase'

import hamburger from './images/hamburger.png';
import icecream from './images/icecream.png';
import doughnut from './images/doughnut.png';
import taco from './images/taco.png';
import pizza from './images/pizza.png';
import pretzl from './images/pretzl.png';
import hotdog from './images/hotdog.png';
import tvlLogo from './images/tvl_logo1.png'

import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import About from "./About";
import Home from "./Home";
import Portfolio from "./Portfolio";
import products from "./derivatives";

import './App.css';
import Footer from "./Footer";

require("firebase/functions");
var functions = firebase.functions();

const axios = require('axios');


function App() {

    const [web3, setWeb3] = useState();
    const [account, setAccount] = useState();
    const [page, setPage] = useState('home');
    const [firstClick, setFirstClick] = useState(true);
    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const[currentPrices, setCurrentPrices] = useState([])

    useEffect(() => {

        if(web3 && firstClick){
            setInterval(async () => {

                const network = await web3.eth.net.getId();

                if(network !== 1){
                    setAlertMessage("Connect Wallet to Mainnet");
                    setShowAlert(true);
                    return
                }

                let newAccount = (await web3.eth.getAccounts())[0];

                if (newAccount !== account) {
                    setAccount(newAccount);
                }

            }, 1000);
            setFirstClick(false);

        }
        getCurrentPrices();


    }, [web3])

    const loadWeb3 =  async() => {

        console.log('inside');

        const provider = await web3Modal.connect();
        const _web3 = await new Web3(provider);
        let _account = (await _web3.eth.getAccounts())[0];

        setAccount(_account);
        setWeb3(_web3);

    }

    const getCurrentPrices =  async() => {

        var getPriceData = firebase.functions().httpsCallable('getPrices');
        getPriceData({})
            .then((result) => {
                console.log(result.data)
                setCurrentPrices(result.data);
            });
/*
        await axios.get('https://us-central1-tvl-snacks.cloudfunctions.net/getPrices')
            .then((response) => {
                // handle success
                console.log(response);
                setCurrentPrices(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
 */
    }

  return (
      <div>
        <div className="d-flex justify-content-between p-4">
            <div>
                <img  src={tvlLogo} height="45px" />
            </div>
            <div className="d-md-none" style={{height:30, width:36}}>
            <Menu right>
                <Button variant="link" onClick={() => {setPage('home')}}> Home </Button>
                <Button variant="link" onClick={() => {setPage('portfolio')}}> My Portfolio </Button>
                <Button variant="link" onClick={() => {setPage('about')}}> About </Button>
                <Button  variant="link"
                     onClick={loadWeb3}>
                    {(!account)?
                        "Wallet"
                        :
                        `${account.substring(0,6)}...${account.slice(account.length - 4)}`
                    }
                </Button>
            </Menu>
            </div>
            <div className="d-none d-md-block" >
                <Button variant="link" onClick={() => {setPage('home')}}> Home </Button>
                <Button variant="link" onClick={() => {setPage('portfolio')}}> My Portfolio </Button>
                <Button variant="link" onClick={() => {setPage('about')}}> About </Button>
            </div>
            <div className="d-none d-md-block">
                <Button  style={{
                    height:40,
                    width:175
                }} onClick={loadWeb3}>
                    {(!account)?
                        "CONNECT WALLET"
                        :
                        `${account.substring(0,6)}...${account.slice(account.length - 4)}`
                    }
                </Button>
            </div>
        </div>


          <div>
              {(page === 'home')? <Home web3={web3} derivativesList={products} prices={currentPrices}/> :<div></div>}
              {(page === 'portfolio')? <Portfolio web3={web3} derivativesList={products} prices={currentPrices}/> :<div></div>}
              {(page === 'about')? <About/> :<div></div>}
          </div>
          <div style={{height:200}}></div>
          <Footer />

        <FallingFoods />
        <AlertModal
            message={alertMessage}
            show={showAlert}
            onHide={() => setShowAlert(false)}
        />
        <SuccessModal
            message={successMessage}
            show={showSuccess}
            onHide={() => setShowSuccess(false)}
        />
    </div>
  );
}

export default App;


function FallingFoods() {

    return (
        <div className="leaf" >
            <div>
                <img src={hamburger} height="75px" width="75px" />
            </div>
            <div>
                <img src={doughnut} height="75px" width="75px" />
            </div>
            <div>
                <img  src={pizza} height="75px" width="75px" />
            </div>
            <div>
                <img src={taco} height="75px" width="75px" />
            </div>
            <div>
                <img src={icecream} height="75px" width="75px" />
            </div>
            <div>
                <img  src={pretzl} height="75px" width="75px" />
            </div>
        </div>

    );
}

