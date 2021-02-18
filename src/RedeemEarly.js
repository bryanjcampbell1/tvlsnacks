import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {empABI,erc20ABI} from "./ABI";

function RedeemEarly(props) {

    const [amount, setAmount ] = useState(0);

    const  approve = async() => {

        let redeemAmount = props.web3.utils.toWei(amount.toString());
        //let redeemAmount = props.web3.utils.toWei("10000");

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

    const redeemEarly = async() => {

        const fromAddress = (await props.web3.eth.getAccounts())[0];
        let emp = new props.web3.eth.Contract(empABI, props.empAddress);

        let redeemAmount = props.web3.utils.toWei(amount.toString());

        await emp.methods.redeem({ rawValue: redeemAmount }).send({from: fromAddress})
            .then(function(receipt){
                // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                console.log(receipt);
            });
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
                        variant="info"
                    >APPROVE</Button>
                </div>

                <div style={{marginTop: 10}}>
                    <Button
                        onClick={() => { redeemEarly() }}
                        style={{width: '100%'}}
                        variant="info"
                    >REDEEM EARLY</Button>
                </div>
            </div>
        </div>
    );
}

export default RedeemEarly;
