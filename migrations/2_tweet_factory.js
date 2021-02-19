
const TweetFactory = artifacts.require("TweetFactory.sol");

module.exports = function(deployer) {
    return deployer.then(()=>{
        console.log("Waiting for tweet to deploy");
        return deployer.deploy(TweetFactory);
    })
    .then(()=>{
        console.log("Tweet Deployed");
    })
}