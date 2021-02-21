import React, {useEffect, useState} from 'react';
import {Row, Col, Form,Button} from 'react-bootstrap';
import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import {DashCircle, PlusCircle} from "react-bootstrap-icons";


function ManageCollateral(props) {

    const [amount, setAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const [moreDetails, setMoreDetails] = useState(false);

    const  approve = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }
            let approveAmount = props.web3.utils.toWei(amount.toString(), 'mwei');
            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const collateralToken = new props.web3.eth.Contract(erc20ABI,props.collateralAddress);

            try{
                await collateralToken.methods.approve(
                    props.empAddress,
                    approveAmount
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

    const  addCollateral = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            let amountCollateral = props.web3.utils.toWei(amount.toString(), 'mwei');
            const fromAddress = (await props.web3.eth.getAccounts())[0];

            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            try{
                await emp.methods.deposit({ rawValue: amountCollateral }).send({from: fromAddress});
                props.updateBalances();
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

    const  requestWithdraw = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            let amountWithdraw = props.web3.utils.toWei(amount.toString(), 'mwei');

            try{
                await emp.methods.requestWithdrawal({ rawValue:amountWithdraw}).send({from: fromAddress});
            }
            catch(e){
                console.log(e);
            }
        }
        else {
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
        }

    }

    const  withdrawAfterLiveness = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            try{
                await emp.methods.withdrawPassedRequest().send({from: fromAddress});
                props.updateBalances();
            }
            catch(e){
                console.log(e);
            }

        }
        else {
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
        }
    }

    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center'
        }}>

            <div style={{textAlign:'center'}}>
                <p style={{fontSize: 20,
                    fontWeight: '900',
                    margin:20
                }}>Manage Collateral</p>
            </div>
            <div>
                {
                    (moreDetails)?
                        <div>
                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                <DashCircle style={{marginTop:5}} onClick={() => setMoreDetails(0)}/>
                                <p  style={{marginLeft:6, fontSize: 16,
                                    fontWeight: '600'}} onClick={() => setMoreDetails(0)}>Details</p>
                            </div>
                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>{props.position} Minted Tokens</p>

                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>{props.collateralAmount} {props.collateralName} Collateral</p>

                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>My Collateral Ratio: {Number(props.collateralAmount/(props.price * props.synthBalance)).toFixed(2)}</p>

                            <p style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginTop:10
                            }}>Min Collateral Ratio: {props.cRatio}</p>
                        </div>
                        :
                        <div>
                            <div style={{display:'flex', justifyContent:'flex start'}}>
                                <PlusCircle style={{ marginTop:5}} onClick={() => setMoreDetails(true)}/>
                                <p style={{marginLeft:6, fontSize: 16,
                                    fontWeight: '600'}} onClick={() => setMoreDetails(true)}>Details</p>
                            </div>
                        </div>

                }

                <div style={{width:'100%', textAlign:'start'}}>
                    <Form>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Add Collateral</Form.Label>
                            <Form.Control
                                onChange={(e)=> {setAmount(e.target.value)}}
                                type="quantity"
                                placeholder="Collateral Amount" />
                        </Form.Group>
                    </Form>
                    <p>Step 1: Approve spending collateral</p>
                    <Button
                        onClick={() => { approve() }}
                        style={{width: '100%'}}
                    >APPROVE</Button>
                    <p style={{marginTop:10}}>Step 2: Add Collateral</p>
                    <Button
                        onClick={() => { addCollateral() }}
                        style={{width: '100%', marginTop: 10}}
                    >DEPOSIT</Button>
                </div>

                <div style={{width:'100%', textAlign:'start'}}>
                    <Form>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Withdraw Collateral</Form.Label>
                            <Form.Control
                                onChange={(e)=> {setAmount(e.target.value)}}
                                type="quantity"
                                placeholder="Collateral Amount" />
                        </Form.Group>
                    </Form>
                    <p style={{
                        fontSize: 16,
                        fontWeight: '500',
                    }}> In order to "Withdraw" at least 2 hours must have passed since initiating a "Request Withdraw" transaction.</p>
                    <p style={{marginTop:10}}>Step 1: Request Withdraw</p>
                    <Button
                        onClick={() => { requestWithdraw() }}
                        style={{width: '100%', marginTop:-10}}
                    >REQUEST WITHDRAW</Button>
                    <p style={{marginTop:10}}>Step 2: Withdraw</p>
                    <Button
                        onClick={() => { withdrawAfterLiveness() }}
                        style={{width: '100%', marginTop:-10}}
                    >WITHDRAW</Button>

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

export default ManageCollateral;
