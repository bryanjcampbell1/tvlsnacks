import React, {useEffect, useState} from 'react';
import {Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";
import {DashCircle, PlusCircle} from "react-bootstrap-icons";


function AddCollateral(props) {

    const [amount, setAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const [moreDetails, setMoreDetails] = useState(false);
    const [spinner, setSpinner] = useState(false)

    const  approve = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 1 ) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            setSpinner(true);

            let approveAmount = props.web3.utils.toWei(amount.toString(), 'mwei');
            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const collateralToken = new props.web3.eth.Contract(erc20ABI,props.collateralAddress);

            try{
                await collateralToken.methods.approve(
                    props.empAddress,
                    approveAmount
                ).send({from: fromAddress})

                setSpinner(false);
            }
            catch(e){
                console.log("error: ", e)
                setSpinner(false);
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

            if (network !== 1) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            setSpinner(true);
            let amountCollateral = props.web3.utils.toWei(amount.toString(), 'mwei');
            const fromAddress = (await props.web3.eth.getAccounts())[0];

            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            try{
                await emp.methods.deposit({ rawValue: amountCollateral }).send({from: fromAddress});
                props.updateBalances();
                setSpinner(false);
            }
            catch(e){
                console.log("error: ", e)
                setSpinner(false);
                return
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
                }}>Add Collateral</p>
            </div>
            <div>
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
                                    fontWeight: 'bold'}} onClick={() => setMoreDetails(true)}>Details</p>
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
                    <p style={{fontWeight:'bold'}}>Step 1: Approve spending collateral</p>
                    <Button
                        onClick={() => { approve() }}
                        style={{width: '100%',marginTop: -10}}
                    >APPROVE</Button>
                    <p style={{marginTop:10, fontWeight:'bold'}}>Step 2: Add Collateral</p>
                    <Button
                        onClick={() => { addCollateral() }}
                        style={{width: '100%', marginTop: -10}}
                    >DEPOSIT</Button>
                </div>
            </div>
            <div>
                {
                    (spinner)?
                        <div style={{zIndex:3,width:'100%',marginTop:-200, display:'flex', justifyContent:'center'}}>
                            <Spinner animation="border" variant="danger" />
                        </div>
                        :
                        <></>
                }
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

export default AddCollateral;
