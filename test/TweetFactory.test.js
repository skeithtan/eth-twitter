require('chai').should();

const { expectRevert } = require('@openzeppelin/test-helpers');

const TweetFactory = artifacts.require("TweetFactory");

function getTweetIdFromTransaction(transaction) {
    return transaction.logs[0].args.tweetId.words[0]
}

contract("TweetFactory", function() {
    beforeEach(async () => {
        this.TweetFactory = await TweetFactory.new();
    });

    describe("Creating tweets", () => {
        it("Should be able to create Tweets", async () => {
            const testMessage = "It's a new day in America.";
            const testAuthor = "Joe Biden";
            await this.TweetFactory.createTweet(testMessage, testAuthor);
            const { message, author } = await this.TweetFactory.getTweet(1);

            message.should.equal(testMessage);
            author.should.equal(testAuthor);
        });
    });

    describe("Updating tweets", () => {
        const author = "Barack Obama";
        const falseAuthor = "Donald Trump";

        it("Should update a tweet from the same author", async () => {
            const transaction = await this.TweetFactory.createTweet("We are joining the Paris Climate Agreement!", author);
            const tweetId = getTweetIdFromTransaction(transaction);

            const newMessage = "Today, America is joining the Paris Climate Agreement!";
            await this.TweetFactory.updateTweet(tweetId, newMessage, author);
            const { message } = await this.TweetFactory.getTweet(tweetId);
            message.should.equal(newMessage);
        });

        it("Should not update a tweet from a different author", async () => {
            const transaction = await this.TweetFactory.createTweet("We are joining the Paris Climate Agreement!", author);
            const tweetId = getTweetIdFromTransaction(transaction);

            const newMessage = "America is pulling out of the Paris agreement immediately.";
            await expectRevert(
                this.TweetFactory.updateTweet(tweetId, newMessage, falseAuthor),
                "Tweet update requests must come the original author -- Reason given: Tweet update requests must come the original author."
            );
        })
    });

    describe("Deleting tweets", () => {
        it("Should delete a tweet from the same author", async () => {
            const author = "Donald Trump";
            const transaction = await this.TweetFactory.createTweet("Covfefe", author);
            const tweetId = getTweetIdFromTransaction(transaction);
            await this.TweetFactory.deleteTweet(tweetId, author);
            await expectRevert(
                this.TweetFactory.getTweet(tweetId),
                "Tweet has been deleted"
            );
        });

        it("Should not delete a tweet from a different author", async () => {
            const author = "Mike Pence";
            const falseAuthor = "Donald Trump";

            const transaction = await this.TweetFactory.createTweet("We should not storm the US capitol.", author);
            const tweetId = getTweetIdFromTransaction(transaction);
            await expectRevert(
                this.TweetFactory.deleteTweet(tweetId, falseAuthor),
                "Tweet deletion requests must come from the original author -- Reason given: Tweet deletion requests must come from the original author."
            );
        })
    });

    describe("Retrieving tweets", () => {
        it("Should chronologically get tweets in a list", async () => {
            const message1 = "Bitcoin go brr";
            const author1 = "Elon Musk";

            const message2 = "GME will fall to 20, fast.";
            const author2 = "Citron Research";

            await this.TweetFactory.createTweet(message1, author1);
            await this.TweetFactory.createTweet(message2, author2);

            const [tweet2, tweet1] = await this.TweetFactory.getTweets();
            tweet1.message.should.equal(message1);
            tweet1.author.should.equal(author1);
            
            tweet2.message.should.equal(message2);
            tweet2.author.should.equal(author2);
        });

        it("Should not show deleted tweets from the list", async () => {
            const message1 = "Bitcoin go brr";
            const author1 = "Elon Musk";

            const message2 = "GME will fall to 20, fast.";
            const author2 = "Citron Research";

            const message3 = "We will no longer publish short reports";
            const author3 = "Citron Research";

            await this.TweetFactory.createTweet(message1, author1);

            const transaction = await this.TweetFactory.createTweet(message2, author2);
            const targetDeleteId = getTweetIdFromTransaction(transaction);

            await this.TweetFactory.createTweet(message3, author3);
            await this.TweetFactory.deleteTweet(targetDeleteId, author2);

            const tweets = await this.TweetFactory.getTweets();
            tweets.length.should.equal(2);
            const [tweet3, tweet1] = tweets;

            tweet1.message.should.equal(message1);
            tweet1.author.should.equal(author1);

            tweet3.message.should.equal(message3);
            tweet3.author.should.equal(author3);
        });
    });
});