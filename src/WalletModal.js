import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";


const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "ed09c851cd06475aba678fdb5e84a15c" // required
        }
    }
};

const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
});

export default web3Modal;
