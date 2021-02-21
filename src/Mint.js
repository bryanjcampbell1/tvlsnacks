import {Button, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";

import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import {DashCircle, PlusCircle} from "react-bootstrap-icons";

function Mint(props) {

    const [mintAmount, setMintAmount ] = useState(0);
    const [collateralAmount, setCollateralAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const [moreDetails, setMoreDetails] = useState(false);
    const [gcr, setGCR ] = useState(0);
    const [minCollateralPerToken, setMinCollateralPerToken ] = useState(0);

    useEffect(() => {
        if(props.web3 && props.empAddress) {
            getGCR();
        }
    },[props]);

    const getGCR = async() => {

        const network = await props.web3.eth.net.getId();

        if (network !== 42) {
            setAlertMessage("Connect Wallet to Mainnet");
            setShowAlert(true);
            return
        }

        const fromAddress = (await props.web3.eth.getAccounts())[0];
        let empContract = await new props.web3.eth.Contract(empABI,props.empAddress);

        let cumulativeFeeMultiplier = await  empContract.methods.cumulativeFeeMultiplier().call({from: fromAddress});
        let rawTotalPositionCollateral = await  empContract.methods.rawTotalPositionCollateral().call({from: fromAddress});
        let totalTokensOutstanding = await  empContract.methods.totalTokensOutstanding().call({from: fromAddress});

        let GCR = Number(Number(cumulativeFeeMultiplier)*Number(rawTotalPositionCollateral)/(1000000 * Number(totalTokensOutstanding)));

        setGCR(GCR);
        //compare minCR and GCR to determine minCollateralPerToken
        if(Math.ceil(GCR) > Math.ceil(props.cRatio * props.price )){
            setMinCollateralPerToken(Math.ceil(GCR));
        }
        else{
            setMinCollateralPerToken(Math.ceil(props.cRatio * props.price ));
        }


    }

    const  approve = async() => {

        //USDC - mwei because of 6 decimals
        if(props.web3){

            const network = await props.web3.eth.net.getId();

            if(network !== 42){
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            let amount = props.web3.utils.toWei(collateralAmount.toString(), 'mwei');

            if(collateralAmount < Number(mintAmount * props.cRatio * Math.ceil(props.price * 100) / 100)){
                setAlertMessage("Set collateral to a larger amount");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const collateralToken = new props.web3.eth.Contract(erc20ABI,props.collateralAddress);

            try{
                await collateralToken.methods.approve(
                    props.empAddress,
                    amount
                ).send({from: fromAddress})
            }
            catch(e){
                console.log("error: ", e)
                return
            }
        }
        else{
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
        }
    }

    const  sponsorShares= async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            //Calculate Minimum Collateral

            if(collateralAmount < minCollateralPerToken){
                setAlertMessage("Set collateral to a larger amount");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let empContract = new props.web3.eth.Contract(empABI, props.empAddress);

            let cAmount = props.web3.utils.toWei(collateralAmount.toString(), 'mwei');
            let mAmount = props.web3.utils.toWei(mintAmount.toString());

            try{
                await empContract.methods.create(
                    { rawValue:  cAmount},
                    { rawValue:  mAmount}
                ).send({from: fromAddress});

                props.updateBalances();
            }
            catch(e){
                console.log(e);
            }

        }
        else{
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
        }
    }

    return(
        <div style={{width:'100%', textAlign:'start', display:'flex', flexDirection:'column'}}>
            <div style={{textAlign:'center'}}>
                <p style={{fontSize: 20,
                    fontWeight: '900',
                    margin:20
                }}>Mint Tokens</p>
            </div>
            <div >

                {
                    (moreDetails)?
                        <div>
                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                <DashCircle style={{marginTop:5}} onClick={() => setMoreDetails(0)}/>
                                <p  style={{marginLeft:6, fontSize: 16,
                                    fontWeight: 'bold'}} onClick={() => setMoreDetails(0)}>Details</p>
                            </div>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Collateral Type: {props.collateralName} </p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Token Price: {Math.ceil(props.price * 100) / 100} &nbsp; {props.collateralName}</p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Minimum Mint: {props.minMint} Tokens</p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Minimum Collateral Ratio: {props.cRatio}</p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Global Collateralization Ratio: {gcr}</p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Minimum Collateral Per Token: {minCollateralPerToken}</p>

                        </div>
                        :
                        <div>
                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                <PlusCircle style={{ marginTop:5}} onClick={() => setMoreDetails(true)}/>
                                <p style={{marginLeft:6, fontSize: 16,
                                    fontWeight: 'bold'}} onClick={() => setMoreDetails(true)}>Details</p>
                            </div>
                        </div>

                }

                <div style={{width:'100%', textAlign:'start'}}>
                    <Form>
                        <Form.Group controlId="formQuantityMint">
                            <Form.Control
                                onChange={(e)=> {setMintAmount(e.target.value)}}
                                type="quantity"
                                placeholder="Minting Amount" />
                        </Form.Group>
                    </Form>

                    <Form>
                        <Form.Group controlId="formQuantityCollateral">
                            <Form.Control
                                onChange={(e)=> {setCollateralAmount(e.target.value)}}
                                type="quantity"
                                placeholder={`Collateral Amount > ${mintAmount * minCollateralPerToken} ${props.collateralName}`} />
                        </Form.Group>
                    </Form>

                    <p style={{fontWeight:'bold'}}>Step 1: Approve spending collateral</p>
                    <div>
                        <Button
                            onClick={() => { approve() }}
                            style={{width: '100%'}}
                        >APPROVE</Button>
                    </div>
                    <p style={{marginTop:10, fontWeight:'bold'}}>Step 2: Mint shiny new tokens!</p>
                    <div>
                        <Button
                            onClick={() => { sponsorShares() }}
                            style={{width: '100%'}}
                        >MINT</Button>
                    </div>
                </div>
            </div>
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

export default Mint;
