// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TweetFactory {
    event TweetAdded(uint tweetId, string message, string author);
    event TweetUpdated(uint tweetId, string message, string author);
    event TweetDeleted(uint oldTweetId);

    struct Tweet {
        uint id;
        string message;
        string author;
    }

    mapping(uint => Tweet) public tweets;
    uint nextTweetId = 1;
    uint tweetCount = 0;

    // This function has been taken from https://ethereum.stackexchange.com/a/30914
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function createTweet(string memory _message, string memory _author) public {
        uint id = nextTweetId++;
        tweets[id] = Tweet(id, _message, _author);
        tweetCount++;
        emit TweetAdded(id, _message, _author);
    }

    function getTweet(uint id) public view returns (Tweet memory) {
        require(nextTweetId > id && id > 0, "Invalid tweet ID");
        Tweet memory retrievedTweet = tweets[id];
        require(retrievedTweet.id > 0, "Tweet has been deleted");
        return retrievedTweet;
    }


    function getTweets() public view returns (Tweet[] memory) {
        Tweet[] memory timeline = new Tweet[](tweetCount);
        uint idx = 0;

        for(uint i = nextTweetId - 1; i > 0; i--) {
            Tweet memory curTweet = tweets[i];

            // Means it's not deleted
            if (curTweet.id != 0) {
                timeline[idx++] = curTweet;
            }
        }

        return timeline;
    }

    function deleteTweet(uint id, string memory _author) public {
        require(nextTweetId > id && id > 0, "Invalid tweet ID");
        Tweet memory retrievedTweet = tweets[id];
        require(compareStrings(retrievedTweet.author, _author), "Tweet deletion requests must come from the original author");
        delete tweets[id];
        tweetCount--;
        emit TweetDeleted(id);
    }

    function updateTweet(uint id, string memory _message, string memory _author) public {
        require(nextTweetId > id && id > 0, "Invalid tweet ID");
        Tweet memory oldTweet = tweets[id];
        require(compareStrings(oldTweet.author, _author), "Tweet update requests must come the original author");
        Tweet memory newTweet = Tweet(id, _message, _author);
        tweets[id] = newTweet;
        emit TweetUpdated(id, _message, _author);
    }
}