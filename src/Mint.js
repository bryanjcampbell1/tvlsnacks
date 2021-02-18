import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";

import {empABI,erc20ABI} from "./ABI";

function Mint(props) {

    const [mintAmount, setMintAmount ] = useState(0);
    const [collateralAmount, setCollateralAmount] = useState(0);

    const  approve = async() => {

        //USDC - mwei because of 6 decimals
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

    const  sponsorShares= async() => {

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
                        variant="info"
                    >APPROVE</Button>
                </div>

                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { sponsorShares() }}
                        style={{width: '100%'}}
                        variant="info"
                    >MINT</Button>
                </div>
            </div>
        </div>
    );
}

export default Mint;
