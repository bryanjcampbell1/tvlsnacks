import React, {useEffect, useState} from 'react';
import {Form,Button} from 'react-bootstrap';

import Mint from './Mint'
import ManageCollateral from "./ManageCollateral";
import RedeemEarly from "./RedeemEarly";
import RedeemAtExpiration from "./RedeemAtExpiration";

import {empABI,erc20ABI} from "./ABI";


function Portfolio(props){

    //Selected Product Info
    const [empAddress, setEmpAddress] = useState('');
    const [synthName, setSynthName] = useState(props.derivativesList[0].tokenName);
    const [synthAddress, setSynthAddress] = useState('');
    const [collateralName, setCollateralName] = useState('');
    const [collateralAddress, setCollateralAddress] = useState('');

    //Info on Position
    const [synthBalance, setSynthBalance] = useState(0);
    const [position, setPosition] = useState(0);
    const [collateralAmount, setCollateralAmount] = useState(0);
    const [minCRatio, setMinCRatio] = useState(0);


    const [action,setAction] = useState();

    const [activeDerivatives,setActiveDerivatives] = useState(props.derivativesList);


    useEffect(() => {
        if(props.web3 && synthName) {
            loadToken();
        }
    },[props.web3, synthName]);


    const  loadToken = async () => {
        let synth = activeDerivatives.filter(c => c.tokenName === synthName)[0];

        setEmpAddress(synth.empAddress);
        setSynthAddress(synth.tokenAddress);
        setCollateralName(synth.collateralToken);
        setCollateralAddress(synth.collateralAddress);

        const myAddress = (await props.web3.eth.getAccounts())[0];

        let empContract = await new props.web3.eth.Contract(empABI,synth.empAddress);

       await  empContract.methods.positions(myAddress).call({from: myAddress}, function(error, result){
            console.log(result);
            setPosition(parseFloat(parseFloat(result.tokensOutstanding)/1000000000000000000).toFixed(3) );
            setCollateralAmount(parseFloat(parseFloat(result.rawCollateral)/1000000).toFixed(3));
        });

       await empContract.methods.collateralRequirement().call({from: myAddress}, function(error, result){
            console.log(result);
            setMinCRatio(parseFloat(parseFloat(result)/1000000000000000000).toFixed(2))

       });


       //Synth Info
        const synthToken = new props.web3.eth.Contract(erc20ABI,synth.tokenAddress);
        await synthToken.methods.balanceOf(myAddress).call({from: myAddress}, function(error, result){
            console.log(result);
            setSynthBalance(parseFloat(parseFloat(result)/1000000000000000000).toFixed(3))
        });


    }


    return(
        <div>
            {
                (props.web3) ?
                <div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={box}>
                            <div style={{
                                width: '40%'
                            }}>
                                <div style={{marginTop: -15}}>
                                    <Form>
                                        <Form.Group controlId="currency" style={{marginTop: 15}}>
                                            <Form.Control as="select"
                                                          onChange={(e) => setSynthName(e.target.value)}>
                                                {
                                                    activeDerivatives.map((item) =>
                                                        <option key={item.id}>{item.tokenName}</option>
                                                    )
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </div>

                                <div style={{display: 'flex', width: '100%'}}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: '100%'
                                    }}>
                                        <p style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                        }}>My Balance</p>
                                        <p style={{
                                            fontSize: 20,
                                            fontWeight: '900',
                                        }}>{synthBalance}</p>
                                    </div>

                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: '100%',
                                }}>
                                    <Button onClick={() => setAction('mint')} style={button1}>MINT</Button>
                                    <Button onClick={() => setAction('manage')} style={button1}>MANAGE
                                        COLLATERAL</Button>
                                    <Button onClick={() => setAction('redeemEarly')} style={button1}>REDEEM
                                        EARLY</Button>
                                    <Button onClick={() => setAction('redeem')} style={button1}>REDEEM EXPIRED</Button>
                                </div>

                            </div>
                            <div style={{
                                width: '60%'
                            }}>
                                <div style={{marginLeft: 40, marginTop: -20}}>
                                    {(action === 'mint') ?
                                        <Mint
                                            web3={props.web3}
                                            synthAddress={synthAddress}
                                            empAddress={empAddress}
                                            collateralAddress={collateralAddress}
                                            collateralName={collateralName}
                                            synthName={synthName}
                                            cRatio={minCRatio}
                                         />
                                    : <div></div>
                                    }
                                    {(action === 'manage') ?
                                        <ManageCollateral
                                            web3={props.web3}
                                            synthAddress={synthAddress}
                                            empAddress={empAddress}
                                            collateralAddress={collateralAddress}
                                            collateralName={collateralName}
                                            synthName={synthName}
                                            cRatio={minCRatio}
                                            collateralAmount={collateralAmount}
                                        />
                                        :
                                        <div></div>
                                    }
                                    {(action === 'redeemEarly') ?
                                        <RedeemEarly
                                            web3={props.web3}
                                            synthAddress={synthAddress}
                                            empAddress={empAddress}
                                            collateralAddress={collateralAddress}
                                            collateralName={collateralName}
                                            synthName={synthName}
                                        />
                                        :
                                        <div></div>
                                    }
                                    {(action === 'redeem') ?
                                        <RedeemAtExpiration
                                            web3={props.web3}
                                            synthAddress={synthAddress}
                                            empAddress={empAddress}
                                            collateralAddress={collateralAddress}
                                            collateralName={collateralName}
                                            synthName={synthName}
                                        />
                                            :
                                        <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: 200}}></div>
                </div>
                :
                    <div style={{display: 'flex',justifyContent:'center'}}>
                        <div style={box2}>
                            <p style={{
                                color:'rgb(235,27,72)',
                                fontSize: 25,
                                fontWeight: '900',
                            }}>Unlock Wallet</p>
                            <p style={{
                                marginTop:-12,
                                color:'rgb(235,27,72)',
                                fontSize: 25,
                                fontWeight: '900',}}>to </p>
                            <p style={{
                                marginTop:-12,
                                color:'rgb(235,27,72)',
                                fontSize: 25,
                                fontWeight: '900',}}>Continue</p>
                        </div>
                        <div style={{height: 800}}></div>
                    </div>
            }
        </div>
    );
}

const button1 = {
    marginTop:20,
    width:'90%',
    borderColor:'#ff7961',
    backgroundColor:'#ff7961',
}

const box = {
    width:"70%",
    backgroundColor:'#ffb3b5',
    opacity: 0.82,
    border:'6px solid #ff7961',
    borderRadius:10,
    padding:20,
    display:'flex',
}

const box2 = {
    width:"40%",
    height:180,
    backgroundColor:'#ffb3b5',
    opacity: 0.82,
    border:'6px solid #ff7961',
    borderRadius:10,
    padding:20,
    marginTop:80,
    textAlign:'center'
}

export default Portfolio;
