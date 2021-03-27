import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord,faTwitter,faTelegram, faMedium, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'


const socialIcon = {
    fontSize:'22px',
    marginTop:'20px',
    marginRight:'20px',
    color:'lightgrey'
};
const socialIconHov  = {
    fontSize:'22px',
    marginTop:'20px',
    marginRight:'20px',
    color:'whitesmoke'
};

const ftext = {
    fontSize: 16,
    marginTop: 20,
    marginRight: 20,
    fontFamily: 'Montserrat',
    color: 'lightgrey'
}

const ftextHov = {
    fontSize: 16,
    marginTop: 20,
    marginRight: 20,
    fontFamily: 'Montserrat',
    color: 'white'
}


function Footer() {

    const [dHov, setDHov] = useState(false);
    const [telHov, setTelHov] = useState(false);
    const [twitHov, setTwitHov] = useState(false);

    return (

        <div style={{backgroundColor: 'rgb(235,27,72)',  height: 40, display: 'flex', justifyContent: 'space-between', paddingLeft:20,paddingRight:20}}>

            <div className="d-none d-sm-block">
                <p style={{marginTop:10,fontSize: 16, fontFamily: 'Montserrat', color: 'white'}}>&nbsp;
                    tvlsnacks.finance</p>
            </div>

        <div style={{display:'flex', marginTop:-10}}>
            {/*
            <a href="https://twitter.com/FlowerboxF">
                <FontAwesomeIcon icon={faTwitter}
                                 onMouseEnter={() => setTwitHov(true)}
                                 onMouseLeave={() => setTwitHov(false)}
                                 style={(twitHov) ? socialIconHov : socialIcon}/>
            </a>

            <a href="https://medium.com/@flowerboxfinance">
                <FontAwesomeIcon icon={faMedium}
                                 onMouseEnter={() => setTelHov(true)}
                                 onMouseLeave={() => setTelHov(false)}
                                 style={(telHov) ? socialIconHov : socialIcon}/>
            </a>
*/}
            <a href="https://t.me/joinchat/mUNuc_4rn_81OGM5">
                <FontAwesomeIcon icon={faTelegramPlane}
                                 onMouseEnter={() => setDHov(true)}
                                 onMouseLeave={() => setDHov(false)}
                                 style={(dHov) ? socialIconHov : socialIcon}

                />
            </a>
    </div>
        </div>
    );
}



export default Footer;
