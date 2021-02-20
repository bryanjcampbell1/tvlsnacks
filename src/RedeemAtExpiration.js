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

            await emp.methods.settleExpired().send({from: fromAddress})
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
                fontSize: 18,
                fontWeight: '600',
                marginTop:20
            }}>Redeem Expired</p>

            <div style={{width:'90%', marginTop:20}}>
                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                }}> In order to settle your position we need to approve spending your entire synthetic token balance.</p>

                <Button
                    onClick={() => { approve() }}
                    style={{width: '100%', marginTop: 10}}
                >APPROVE</Button>
            </div>

            <div style={{width:'90%', marginTop:20}}>
                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                }}> Burn synthetic tokens and get collateral tokens.</p>

                <Button
                    onClick={() => { settleExpired() }}
                    style={{width: '100%', marginTop: 10}}
                >BURN TOKENS</Button>
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
