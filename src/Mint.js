import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";

import {empABI,erc20ABI} from "./ABI";
import AlertModal from "./AlertModal";
import SuccessModal from "./SuccessModal";

function Mint(props) {

    const [mintAmount, setMintAmount ] = useState(0);
    const [collateralAmount, setCollateralAmount] = useState(0);

    const[showAlert, setShowAlert] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[alertMessage, setAlertMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

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

            const fromAddress = (await props.web3.eth.getAccounts())[0];
            let empContract = new props.web3.eth.Contract(empABI, props.empAddress);

            let cAmount = props.web3.utils.toWei(collateralAmount.toString(), 'mwei');
            let mAmount = props.web3.utils.toWei(mintAmount.toString());

            await empContract.methods.create(
                { rawValue:  cAmount},
                { rawValue:  mAmount}
            ).send({from: fromAddress})
                .then(function(receipt){
                    console.log("receipt: ")
                    console.log(receipt)
                    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                });

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
            <p style={{fontSize: 18,
                fontWeight: '600',
                margin:20
            }}>Mint Tokens</p>

            <div style={{width:'90%', textAlign:'start'}}>

                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginTop:10
                }}>Collateral Type: {props.collateralName}</p>
                <p style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginTop:10
                }}>Minimum Collateral Ratio: {props.cRatio}</p>

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
                            placeholder="Collateral Amount" />
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
                        onClick={() => { sponsorShares() }}
                        style={{width: '100%'}}
                    >MINT</Button>
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
