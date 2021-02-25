const functions = require('firebase-functions');
const axios = require('axios');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const defipulse_api_key = '**********************************'

exports.getPrices = functions.https.onCall(async (data, context) => {
    const prices = await getCurrentPrices()
    functions.logger.info("prices: ", prices);

    return prices;
});


exports.getPricesHTTPS = functions.https.onRequest(async(request, response) => {

    const prices = await getCurrentPrices()
    functions.logger.info("prices: ", prices);
    response.send(prices);

});

const getCurrentPrices =  async() => {

    let allProjects = [];
    let prices = []

    await axios.get(`https://data-api.defipulse.com/api/v1/defipulse/api/MarketData?api-key=${defipulse_api_key}`)
        .then(function (response) {
            // handle success
            let allTVL = {
                "name": "All",
                "tvl": response.data.All.total
            };
            allProjects.push(allTVL);

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

    await axios.get(`https://data-api.defipulse.com/api/v1/defipulse/api/GetProjects?api-key=${defipulse_api_key}`)
        .then(function (response) {
            // handle success

            response.data.forEach(project =>{
                    let name = project.name;
                    let tvl = project.value.tvl.USD.value;

                    let projectTVL ={
                        "name": name,
                        "tvl": tvl
                    }

                    allProjects.push(projectTVL);
                }
            )

            let defipulseTVL_ALL = {
                priceId: 'DEFI_PULSE_TOTAL_TVL',
                price: Number(Number(allProjects.filter(project => project.name === 'All' )[0].tvl)/1000000000).toFixed(6)
            }

            prices.push(defipulseTVL_ALL);

            let sushi = Number(allProjects.filter(project => project.name === 'SushiSwap' )[0].tvl);
            let uni = Number(allProjects.filter(project => project.name === 'Uniswap' )[0].tvl);

            let sushiuni_TVL = {
                priceId: 'SUSHIUNI_TVL',
                price: Number(10*sushi/uni).toFixed(6)
            }

            prices.push(sushiuni_TVL);

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

    return prices;
}
