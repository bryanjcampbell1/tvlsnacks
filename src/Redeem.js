import React, {useState} from "react";

import RedeemEarly from "./RedeemEarly";
import RedeemAtExpiration from "./RedeemAtExpiration";

function Redeem(props) {

    return(
        <>
        {( props.expirationTimestamp*1000 > Date.now() )?
            <RedeemEarly
                web3={props.web3}
                synthAddress={props.synthAddress}
                empAddress={props.empAddress}
                collateralAddress={props.collateralAddress}
                collateralName={props.collateralName}
                synthName={props.synthName}
                minMint={props.minMint}
                updateBalances={() => {props.updateBalances()}}
            />
                :
            <RedeemAtExpiration
                web3={props.web3}
                synthAddress={props.synthAddress}
                empAddress={props.empAddress}
                collateralAddress={props.collateralAddress}
                collateralName={props.collateralName}
                synthName={props.synthName}
                minMint={props.minMint}
                updateBalances={() => {props.updateBalances()}}
            />
        }
        </>
    );
}

export default Redeem;
