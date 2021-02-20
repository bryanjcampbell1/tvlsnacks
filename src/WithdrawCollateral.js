import React, {useEffect, useState} from 'react';
import {Row, Col, Form,Button} from 'react-bootstrap';
import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import {DashCircle, PlusCircle} from "react-bootstrap-icons";


function WithdrawCollateral(props) {

    const [amount, setAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const [moreDetails, setMoreDetails] = useState(false);

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
                }}>Withdraw Collateral</p>
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
                            <Form.Control
                                onChange={(e)=> {setAmount(e.target.value)}}
                                type="quantity"
                                placeholder="Collateral Amount" />
                        </Form.Group>
                    </Form>
                    <p style={{marginTop:10}}>Step 1: Request Withdraw</p>
                    <Button
                        onClick={() => { requestWithdraw() }}
                        style={{width: '100%', marginTop:-10}}
                    >REQUEST WITHDRAW</Button>
                    <p style={{marginTop:10}}>Step 2: Withdraw</p>
                    <div style={{marginTop:-10, width:420, display:'flex', justifyContent:'center', border: '1px solid rgb(235,27,72)', borderRadius:'5px',padding:10 }} >
                        <p style={{
                            fontSize: 16,
                            fontWeight: '500',
                        }}>
                            In order to "Withdraw" at least 2 hours must have passed since initiating a "Request Withdraw" transaction.
                        </p>
                    </div>

                    <Button
                        onClick={() => { withdrawAfterLiveness() }}
                        style={{width: '100%', marginTop:10}}
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

export default WithdrawCollateral;
