import {Button, Form, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";

function RedeemEarly(props) {

    const [amount, setAmount ] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const [spinner, setSpinner] = useState(false)

    const  approve = async() => {



        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            setSpinner(true);
            let redeemAmount = props.web3.utils.toWei(amount.toString());
            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const synthToken = new props.web3.eth.Contract(erc20ABI,props.synthAddress);

            try{
                await synthToken.methods.approve(
                    props.empAddress,
                    redeemAmount
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
            setSpinner(false);
        }
    }

    const redeemEarly = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            setSpinner(true);
            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            let redeemAmount = props.web3.utils.toWei(amount.toString());

            try{
                await emp.methods.redeem({ rawValue: redeemAmount }).send({from: fromAddress});
                props.updateBalances();

            }
            catch (e) {
                console.log(e)
                setSpinner(false);
            }

        }
        else{
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
            setSpinner(false);
        }
    }

    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center'
        }}>
            <p style={{fontSize: 20,
                fontWeight: '900',
                margin:20
            }}>Redeem Early</p>

            <div style={{width:'90%'}}>
                <div style={{marginTop:-10, width:'100%', border: '1px solid rgb(235,27,72)', borderRadius:'5px',padding:10 }} >
                    <p >Token sponsors can redeem tokens even before the expiration date.</p>
                    <p >You cannot redeem an amount of tokens that will bring you below the minimum sponsor size of {props.minMint} without redeeming your entire position.</p>
                </div>
                <Form style={{marginTop:20}}>
                    <Form.Group controlId="formQuantityRedeem">
                        <Form.Control
                            onChange={(e)=> {setAmount(e.target.value)}}
                            type="quantity"
                            placeholder="Redeem Amount" />
                    </Form.Group>
                </Form>
                <p style={{fontWeight:'bold'}}>Step 1: Approve synthetic token burn</p>
                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { approve() }}
                        style={{width: '100%', marginTop:-10}}
                    >APPROVE</Button>
                </div>
                <p style={{marginTop:10, fontWeight:'bold'}}>Step 2: Redeem Tokens</p>
                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { redeemEarly() }}
                        style={{width: '100%', marginTop:-10}}
                    >REDEEM EARLY</Button>
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

export default RedeemEarly;
