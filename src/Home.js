import React, {useState} from 'react';
import './App.css';
import UMASynth from "./UMASynth";
import {Button, Row, Col, Container} from 'react-bootstrap';



function Home(props){

    const [currentValue, setCurrentValue] =useState(0)

    return(
        <div>
            <div style={{textAlign:'center', marginTop:50}}>
                <p className="bigHeroText">TVL SNACKS</p>
                <p className="smHeroText">All you can eat derivatives</p>
            </div>
            <div>
                {
                    props.derivativesList
                        .map((row, key) =>
                            <>
                                <Container key={key} className="d-flex justify-content-center align-items-center" style={{minHeight:"100vh"}}>
                                    <div className="w-100" style={{maxWidth:400 }}>

                                        <UMASynth
                                              project={row.project}
                                              tokenName={row.tokenName}
                                              tokenAddress={row.tokenAddress}
                                              expires={row.expires}
                                              collateralToken={row.collateralToken}
                                              collateralAddress={row.collateralAddress}
                                              web3={props.web3}
                                              description={row.description}
                                              currentPrice={currentValue}
                                              multiplyBy={Number(row.multiplyFactor)}
                                              divideBy={Number(row.divideFactor)}
                                              priceData={props.priceData}
                                        />
                                    </div>
                                </Container>
                            </>
                        )
                }
            </div>
        </div>
    );
}


export default Home;


