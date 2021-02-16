require('chai').should();

const { expectRevert } = require('@openzeppelin/test-helpers');

const TweetFactory = artifacts.require("TweetFactory");

contract("TweetFactory", function([user0, user1]) {
    beforeEach(async () => {
        this.TweetFactory = await TweetFactory.new();
    });

    describe("Creating tweet", () => {
        it("Should be able to create Tweets", async () => {
            const now = new Date().getTime() / 1000;
            await this.TweetFactory.createTweet("Hello, World!", "Barack Obama", Math.floor(now));
            const tweet = await this.TweetFactory.getTweet(0);
            console.log("Retrieved tweet", tweet);
        });
    });
});