import React, {useEffect, useState} from 'react';
import {Row, Col, Form,Button} from 'react-bootstrap';
import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";


function ManageCollateral(props) {

    const [amount, setAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

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
                await emp.methods.deposit({ rawValue: amountCollateral }).send({from: fromAddress})
                    .then(function(receipt){
                        // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                        console.log(receipt);
                    });
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

            await emp.methods.requestWithdrawal({ rawValue:amountWithdraw}).send({from: fromAddress})
                .then(function(receipt){
                    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                    console.log(receipt);
                });
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

            await emp.methods.withdrawPassedRequest().send({from: fromAddress})
                .then(function(receipt){
                    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                    console.log(receipt);
                });
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
            <p style={{
                fontSize: 20,
                fontWeight: '600',
                marginTop:20
            }}>Manage Collateral</p>

            <div style={{width:'90%'}}>

                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginTop:10
                }}>Collateral Type: {props.collateralName}</p>

                <Form>
                    <Form.Group controlId="formQuantity">
                        <Form.Control
                            onChange={(e)=> {setAmount(e.target.value)}}
                            type="quantity"
                            placeholder="Enter amount" />
                    </Form.Group>
                </Form>
                <div style={{marginTop: 10}}>

                    <Button
                        onClick={() => { approve() }}
                        style={{width: '100%'}}
                    >APPROVE</Button>

                    <Button
                        onClick={() => { addCollateral() }}
                        style={{width: '100%', marginTop: 10}}
                    >DEPOSIT</Button>

                    <Button
                        onClick={() => { requestWithdraw() }}
                        style={{width: '100%', marginTop: 10}}
                    >REQUEST WITHDRAW</Button>
                </div>

            </div>

            <div style={{width:'90%',marginTop:30}}>
                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginTop:10
                }}>Min Collateral Ratio: {props.cRatio}</p>

                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginTop:10
                }}>Collateral Amount: {props.collateralAmount}</p>
            </div>

            <div style={{width:'90%', marginTop:20}}>
                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                }}> In order to "Withdraw" at least 2 hours must have passed since initiating a "Request Withdraw" transaction.</p>

                <Button
                    onClick={() => { withdrawAfterLiveness() }}
                    style={{width: '100%', marginTop: 10}}
                >WITHDRAW</Button>
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
