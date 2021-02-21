import {Button} from "react-bootstrap";
import React, {useState} from "react";
import {empABI, erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";

function RedeemAtExpiration(props) {

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const approve = async() => {

        if(props.web3) {

            const network = await props.web3.eth.net.getId();

            if (network !== 42) {
                setAlertMessage("Connect Wallet to Mainnet");
                setShowAlert(true);
                return
            }

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            const synthToken = new props.web3.eth.Contract(erc20ABI,props.synthAddress);
            const synthTokenBalance = await synthToken.methods.balanceOf(fromAddress).call({from: fromAddress});

            try{
                await synthToken.methods.approve(
                    props.empAddress,
                    synthTokenBalance
                ).send({from: fromAddress})
            }
            catch(e){
                console.log("error: ", e)
                return
            }

        }
        else {
            setAlertMessage("Connect Wallet to Continue");
            setShowAlert(true);
        }

    }

    const settleExpired = async() => {

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
                await emp.methods.settleExpired().send({from: fromAddress});
                props.updateBalances();
            }
            catch (e) {
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
            <p style={{
                fontSize: 20,
                fontWeight: '900',
                margin:20
            }}>Redeem Expired</p>

            <div style={{width:'90%', marginTop:20}}>
                <p style={{fontWeight:'bold'}}>Step 1: Approve synthetic token burn</p>
                <div style={{marginTop:-10, width:'100%', border: '1px solid rgb(235,27,72)', borderRadius:'5px',padding:10 }} >
                    <p style={{
                        fontSize: 16,
                        fontWeight: '500',
                    }}> In order to settle your position we need to approve spending your entire synthetic token balance.</p>
                </div>
                <Button
                    onClick={() => { approve() }}
                    style={{width: '100%', marginTop: 10}}
                >APPROVE</Button>
            </div>

            <div style={{width:'90%', marginTop:10}}>
                <p style={{marginTop:10, fontWeight:'bold'}}>Step 2: Redeem Tokens</p>
                <Button
                    onClick={() => { settleExpired() }}
                    style={{width: '100%', marginTop: -10}}
                >REDEEM</Button>
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

export default RedeemAtExpiration;
