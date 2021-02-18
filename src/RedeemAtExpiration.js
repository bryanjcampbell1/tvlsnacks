import {Button} from "react-bootstrap";
import React from "react";

function RedeemAtExpiration(props) {

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


            <p style={{width:'80%'}}>The easiest way to redeem is via UMA's EMP Tools. Check out the tutorial for more info!</p>

            <Button
                style={{marginTop:20,width:'80%'}}
                href="http://tools.umaproject.org/"
                variant="info"
            >Take Me To EMP Tools!</Button>

            <Button
                style={{marginTop:10,width:'80%'}}
                href="https://docs.umaproject.org/tutorials/redeem-tokens"
                variant="info"
            >Tutorial</Button>

        </div>
    );
}

export default RedeemAtExpiration;
