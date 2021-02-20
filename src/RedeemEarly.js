import {Button, Form} from "react-bootstrap";
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

    const  approve = async() => {



        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            let redeemAmount = props.web3.utils.toWei(amount.toString());
            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const synthToken = new props.web3.eth.Contract(erc20ABI,props.synthAddress);

            try{
                await synthToken.methods.approve(
                    props.empAddress,
                    redeemAmount
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

    const redeemEarly = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let emp = new props.web3.eth.Contract(empABI, props.empAddress);

            let redeemAmount = props.web3.utils.toWei(amount.toString());

            try{
                await emp.methods.redeem({ rawValue: redeemAmount }).send({from: fromAddress});
                props.updateBalances();

            }
            catch (e) {
                console.log(e)
            }

        }
        else{
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
                fontSize: 18,
                fontWeight: '600',
                marginTop:20
            }}>Redeem Early</p>

            <div style={{width:'90%'}}>
                <p >Token sponsors can redeem tokens even before the expiration date.</p>
                <p >You cannot redeem an amount of tokens that will bring you below the minimum sponsor size of {props.minMint} without redeeming your entire position</p>
                <Form>
                    <Form.Group controlId="formQuantityRedeem">
                        <Form.Control
                            onChange={(e)=> {setAmount(e.target.value)}}
                            type="quantity"
                            placeholder="Redeem Amount" />
                    </Form.Group>
                </Form>

                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { approve() }}
                        style={{width: '100%'}}
                    >APPROVE</Button>
                </div>

                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { redeemEarly() }}
                        style={{width: '100%'}}
                    >REDEEM EARLY</Button>
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

export default RedeemEarly;
