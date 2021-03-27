
const products = [
    {
        minCollateralRatio:'1.25',
        minMint:'3',
        priceId: 'DEFI_PULSE_TOTAL_TVL',
        collateralAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        collateralToken:"USDC",
        expires:"4/15/21",
        expirationTimestamp: "1618459200",
        status:"active",
        project:"All",
        description:"At expiration on April 15 2021, the price of this token settles to the sum of the TVL in USD of all projects listed on DeFi Pulse divided by 1,000,000,000",
        empAddress:"0x52f83ACA94904b3590669E3525d25ec75cDFf798",
        tokenAddress:"0x29dddacba3b231ee8d673dd0f0fa759ea145561b",
        tokenName:"DEFI_PULSE_TVL_ALL_APR15"
    },
    {
        minCollateralRatio:'1.25',
        minMint:'12',
        priceId: 'SUSHIUNI_TVL',
        collateralAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        collateralToken:"USDC",
        expires:"7/1/21",
        expirationTimestamp: "1625112000",
        status:"active",
        project:"SUSHIUNI",
        description:"At expiration on July 1 2021, the price of this token settles to 10 USD multiplied by the ratio of SushiSwap TVL to Uniswap TVL.  TVL is measured in USD for both protocols.",
        empAddress:"0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4",
        tokenAddress:"0x43145836a4830d1A9e303dEE2A301765e3F66429",
        tokenName:"SUSHIUNI_JULY1"
    }
    /*{
    minCollateralRatio:'1.25',
    minMint:'3',
    priceId: 'DEFI_PULSE_TOTAL_TVL',
    collateralAddress: "0xe22da380ee6b445bb8273c81944adeb6e8450422",
    collateralToken:"KUSD",
    description:"Kovan Test EMP",
    divideFactor: "1000000000",
    empAddress:"0x2EDa37C78A2E17a96E2589bEf1fFAa471b266b8d",
    expires:"4/1/21 @ 0:00",
    expirationTimestamp: "1617249600",
    multiplyFactor:"1",
    status:"active",
    project:"All",
    tokenAddress:"0x9c029e6607b38320e52c9aa19591f5040c09c0bf",
    tokenName:"KOVAN_TEST-APRIL"
}*/];

export default products;

/* Mainnet
{
    minCollateralRatio:'1.25',
    minMint:'3',
    priceId: 'DEFI_PULSE_TOTAL_TVL',
    collateralAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    collateralToken:"USDC",
    expires:"4/1/21 @ 0:00",
    expirationTimestamp: "1617249600",
    status:"active",
    project:"All",
    description:"At expiration on April 1 2021, the price of this token settles to the sum of the TVL in USD of all projects listed on DeFi Pulse divided by 1,000,000,000",

    empAddress:"0x2B7bf1e037025f613a51eA7Af67ee9418d500835",
    tokenAddress:"0x47d4a1993cb87110aaf0876d73aab03c1d931665",
    tokenName:"DEFI_PULSE_TOTAL_TVL-APRIL"
}
 */
