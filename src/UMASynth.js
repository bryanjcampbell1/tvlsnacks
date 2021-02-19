import React, {useState} from 'react';

import { Button,Form } from 'react-bootstrap';
import {ChevronLeft,DashCircle,PlusCircle} from 'react-bootstrap-icons';

import './App.css';
import Mint from "./Mint";


const axios = require('axios');


function UMASynth(props){

    const [screen, setScreen] = useState(0);
    const [submitState, setSubmitState] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState();
    const [moreDetails, setMoreDetails] = useState(0);
    const [warning, setWarning] = useState("");


    return (
        <div style={box}>
            <p style={{ fontSize: 20,
                fontWeight: '900'}}>{props.tokenName}</p>
            <div style={{
                backgroundColor:'#ff7961',
                height:5,
                width:'100%'
            }}></div>

            {
                (screen === 0)?
                    <div>

                        <p style={{marginTop:20, color:'grey', fontSize:40, fontWeight:900}}>$
                            {Number(props.multiplyBy*parseFloat(props.currentPrice)/props.divideBy).toFixed(2)}
                        </p>
                        <p style={{fontSize: 18,
                            fontWeight: '600'}}>Price if Settled Today
                        </p>
                        <div style={{marginTop:40}}>
                            <Button
                                    style={{width:300}}
                                    href={`https://app.uniswap.org/#/swap?inputCurrency=${props.tokenAddress}&outputCurrency=ETH`}
                                    target="_blank"
                            >BUY / SELL</Button>
                        </div>
                        <br/>
                        <div>
                            <Button
                                    style={{width:300}}
                                    onClick={() => setScreen(1)}
                            >MINT</Button>
                        </div>
                        <br/>
                        <div>
                            <Button
                                    style={{width:300}}
                                    href={`https://app.uniswap.org/#/add/${props.tokenAddress}/ETH`}
                                    target="_blank"
                            >PROVIDE LIQUIDITY</Button>
                        </div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div style={{width:300, marginTop:40}}>
                                {
                                    (moreDetails)?
                                        <div>
                                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                                <DashCircle style={{marginTop:5}} onClick={() => setMoreDetails(0)}/>
                                                <p  style={{marginLeft:6, fontSize: 16,
                                                    fontWeight: '600'}} onClick={() => setMoreDetails(0)}>Details</p>
                                            </div>
                                            <div  style={{textAlign:'start'}}>
                                                <p style={{fontSize: 16,
                                                    fontWeight: '600'}}>{props.description}</p>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                                <PlusCircle style={{ marginTop:5}} onClick={() => setMoreDetails(1)}/>
                                                <p style={{marginLeft:6, fontSize: 16,
                                                    fontWeight: '600'}} onClick={() => setMoreDetails(1)}>Details</p>
                                            </div>
                                        </div>

                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div></div>
            }
            <div>
            {(screen === 1) ?
                <div>
                    <div style={{marginTop:-50, display:'flex', justifyContent:'flex-start'}}>
                        <ChevronLeft onClick={() => setScreen(0)}
                                     color="#ff7961"
                                     size={30}
                        />
                    </div>
                    <div style={{marginTop:20}}>
                        <Mint web3={props.web3}
                              synthAddress={props.tokenAddress}
                              collateralAddress={props.collateralAddress}
                              collateralName={props.collateralToken}
                              synthName={props.tokenName}
                        />
                    </div>
                </div>
                :
                <div></div>
            }
            </div>
        </div>
    );
}



const box1 = {
    width:'100%',
    backgroundColor:'#ff7961',
    borderRadius:10,
    padding:30,
    marginTop:20,
}

const box = {
    width:"100%",
    backgroundColor:'#ffb3b5',
    border:'6px solid #ff7961',
    borderRadius:10,
    padding:20,
    textAlign:'center',
    color:'rgb(192,16,54)'

}

export default UMASynth;


