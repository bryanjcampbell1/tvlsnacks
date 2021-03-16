import React, {useEffect, useState} from 'react';
import {Container,Row,Col,Form,Button} from 'react-bootstrap';

import Mint from './Mint'
import AddCollateral from "./AddCollateral";
import WithdrawCollateral from "./WithdrawCollateral";
import Redeem from "./Redeem";

import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";


function Portfolio(props){

    //Selected Product Info
    const [empAddress, setEmpAddress] = useState('');
    const [synthName, setSynthName] = useState(props.derivativesList[0].tokenName);
    const [synthAddress, setSynthAddress] = useState('');
    const [collateralName, setCollateralName] = useState('');
    const [collateralAddress, setCollateralAddress] = useState('');
    const [minMint,setMinMint] = useState(0);
    const [expirationTimestamp, setExpirationTimestamp] = useState(0);

    //Info on Position
    const [synthBalance, setSynthBalance] = useState(0);
    const [position, setPosition] = useState(0);
    const [collateralAmount, setCollateralAmount] = useState(0);
    const [minCRatio, setMinCRatio] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");


    const [action,setAction] = useState();

    const [activeDerivatives,setActiveDerivatives] = useState(props.derivativesList);

    const [priceId, setPriceId] = useState()
    const [currentPrice, setCurrentPrice] = useState(0);

    const [touch,setTouch] = useState(0);

    useEffect(() => {

        let price = 0;
        if((priceId === "DEFI_PULSE_TOTAL_TVL" && (props.prices.length != 0))){
            price = props.prices.filter(project => project.priceId === "DEFI_PULSE_TOTAL_TVL" )[0].price;
        }
        else if((priceId === "SUSHIUNI_TVL" && (props.prices.length != 0))){
            price = props.prices.filter(project => project.priceId === "SUSHIUNI_TVL" )[0].price;
        }
        else{
            console.log('no matching priceId found')
        }
        setCurrentPrice(price);


        if(props.web3 && synthName) {
            loadToken();
        }
    },[props.web3,props, synthName, touch]);


    const  loadToken = async () => {

        let synth = activeDerivatives.filter(c => c.tokenName === synthName)[0];

        setEmpAddress(synth.empAddress);
        setSynthAddress(synth.tokenAddress);
        setCollateralName(synth.collateralToken);
        setCollateralAddress(synth.collateralAddress);
        setMinCRatio(synth.minCollateralRatio);
        setPriceId(synth.priceId);
        setMinMint(synth.minMint);
        setExpirationTimestamp(Number(synth.expirationTimestamp));

        const network = await props.web3.eth.net.getId();

        if(network !== 1){
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
        }

        const myAddress = (await props.web3.eth.getAccounts())[0];

        let empContract = await new props.web3.eth.Contract(empABI,synth.empAddress);

       await  empContract.methods.positions(myAddress).call({from: myAddress}, function(error, result){
            console.log(result);
            setPosition(parseFloat(parseFloat(result.tokensOutstanding)/1000000).toFixed(3) );
            setCollateralAmount(parseFloat(parseFloat(result.rawCollateral)/1000000).toFixed(3));
        });

       //Synth Info
        const synthToken = new props.web3.eth.Contract(erc20ABI,synth.tokenAddress);
        await synthToken.methods.balanceOf(myAddress).call({from: myAddress}, function(error, result){
            console.log(result);
            setSynthBalance(parseFloat(parseFloat(result)/1000000).toFixed(3))
        });

    }

    return(
        <div>
            {
                (props.web3) ?

                    <div style={{ width:'100%',display: 'flex', justifyContent: 'center'}}>
                        <div style={box}>

                            <Row>
                                <Col xs={12} md={6}>
                                    <div style={{width:'100%',display:'flex', justifyContent:'center'}}>
                                        <div style={{width:'100%',maxWidth:340}}>
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
                                                        fontSize: 20,
                                                        fontWeight: '900',

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
                                                <Button onClick={() => setAction('add')} style={button1}>
                                                    ADD COLLATERAL
                                                </Button>
                                                <Button onClick={() => setAction('withdraw')} style={button1}>
                                                    WITHDRAW COLLATERAL
                                                </Button>
                                                <Button onClick={() => setAction('redeem')} style={button1}>REDEEM TOKENS</Button>
                                            </div>
                                        </div>
                                    </div>

                                </Col>
                                <Col xs={12} md={6} style={{width:'100%',display:'flex', justifyContent:'center'}}>
                                    <div style={{width:'100%', maxWidth:340,}}>
                                        <div >
                                            {(action === 'mint') ?
                                                <Mint
                                                    web3={props.web3}
                                                    synthAddress={synthAddress}
                                                    empAddress={empAddress}
                                                    collateralAddress={collateralAddress}
                                                    collateralName={collateralName}
                                                    synthName={synthName}
                                                    cRatio={minCRatio}
                                                    price={currentPrice}
                                                    minMint={minMint}
                                                    updateBalances={() => {setTouch(touch + 1)}}
                                                />
                                                : <div></div>
                                            }
                                            {(action === 'withdraw') ?
                                                <WithdrawCollateral
                                                    web3={props.web3}
                                                    synthAddress={synthAddress}
                                                    empAddress={empAddress}
                                                    collateralAddress={collateralAddress}
                                                    collateralName={collateralName}
                                                    synthName={synthName}
                                                    synthBalance={synthBalance}
                                                    position={position}
                                                    cRatio={minCRatio}
                                                    collateralAmount={collateralAmount}
                                                    price={currentPrice}
                                                    updateBalances={() => {setTouch(touch + 1)}}
                                                />
                                                :
                                                <div></div>
                                            }
                                            {(action === 'add') ?
                                                <AddCollateral
                                                    web3={props.web3}
                                                    synthAddress={synthAddress}
                                                    empAddress={empAddress}
                                                    collateralAddress={collateralAddress}
                                                    collateralName={collateralName}
                                                    synthName={synthName}
                                                    synthBalance={synthBalance}
                                                    position={position}
                                                    cRatio={minCRatio}
                                                    collateralAmount={collateralAmount}
                                                    price={currentPrice}
                                                    updateBalances={() => {setTouch(touch + 1)}}
                                                />
                                                :
                                                <div></div>
                                            }
                                            {(action === 'redeem') ?
                                                <Redeem
                                                    web3={props.web3}
                                                    synthAddress={synthAddress}
                                                    empAddress={empAddress}
                                                    collateralAddress={collateralAddress}
                                                    collateralName={collateralName}
                                                    synthName={synthName}
                                                    minMint={minMint}
                                                    updateBalances={() => {setTouch(touch + 1)}}
                                                    expirationTimestamp={expirationTimestamp}
                                                />
                                                :
                                                <div></div>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                    </div>
                </div>
                :
                    <div style={{display: 'flex',justifyContent:'center'}}>
                        <div className="d-flex justify-content-center align-items-center p-4" style={box2}>
                            <p style={{
                                color:'rgb(235,27,72)',
                                fontSize: 25,
                                fontWeight: '900',
                            }}>Unlock Wallet to Continue</p>
                        </div>
                        <div style={{height: 800}}></div>
                    </div>
            }
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

const button1 = {
    marginTop:20,
    width:'90%',
    borderColor:'#ff7961',
    backgroundColor:'#ff7961',
}

const box = {

    backgroundColor:'#ffb3b5',
    opacity: 0.82,
    border:'6px solid #ff7961',
    borderRadius:10,
    padding:20,
    width:'70%',
    minWidth:340,
    maxWidth: 700
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
