// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TweetFactory {
    event TweetAdded(uint tweetId, string message, string author, uint256 createdAt);

    struct Tweet {
        uint id;
        string message;
        string author;
        uint256 createdAt;
    }

    Tweet[] public tweets;

    function createTweet(string memory _message, string memory _author, uint256 _createdAt) public {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, _message, _author, _createdAt));
        emit TweetAdded(tweetId, _message, _author, _createdAt);
    }

    function getTweet(uint id) public view returns (Tweet memory) {
        return tweets[id];
    }
}