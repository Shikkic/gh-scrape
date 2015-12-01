var request = require('request'),
    underscore = require('underscore'),
    cheerio = require('cheerio');

// Export Scrape Contribution Data Function
exports.scrapeContributionData = function (url, callback) {
    getRequest(url, function(data) {
        scrapeContributionData(data, function(results){
            callback(results);
        });
    });
};

// Export Scrape Profile Stats Data Function
exports.scrapeContributionStats = function (url, callback) {
    getRequest(url, function(html) {
        scrapeContributionStats(html, function(results) {
            callback(results);
        });
    });
};

// Returns an Object Containing Contribution Stats
// statDataObj = {
//      totalContributions: #,
//      longestStreak: #,
//      currentStreak: #
// };
function scrapeContributionStats(html, callback) {
    $ = cheerio.load(html);
    var statDataObj = {};

    $('.contrib-number').each(function(index, statData) {
        var statData = statData.children[0].data;

        if (index == 0) {
            statDataObj.totalContributions = parseInt(statData);
        } else if (index === 1) {
            statDataObj.longestStreak = parseInt(statData);
        } else {
            statDataObj.currentStreak = parseInt(statData);
        }
    });

    // Validate it contains data before sending
    if (statDataObj) {
        callback(statDataObj);
    } else {
        // If it fails validation return null
        callback(null);
    }
}; 

// Returns an Object Containing Contribution Data
// CommitDataObj = {
//      dataContributionCount: #,
//      dataDate: #,
// };
function scrapeContributionData(html, callback) {
    $ = cheerio.load(html);
    var commitDataArray = [];

    $('rect').each(function(index, commitData) {
        // Look for our contribtion data
        var dataContributionCount = parseInt(commitData.attribs['data-count']);
        var dataDate = commitData.attribs['data-date'];
        var commitDataObj = {};

        // Validate it contains data
        if (dataContributionCount && dataDate) {
            commitDataObj.dataContributionCount = dataContributionCount;
            commitDataObj.dataDate = dataDate;
            commitDataArray.push(commitDataObj);
        } 
    });

    // Validate it contains data before sending
    if (commitDataArray.length > 0) {
        callback(commitDataArray);
    } else {
        // If it fails validation return null
        callback(null);
    }
}; 

// GET Request Helper Function 
function getRequest(gitUrl, callback) {
    var options = {
        url: gitUrl
    };
    request.get(options, function(error, response, body){
        if(!error) {
            callback(body);
        }
        return Error;
    });
};

// Tests
/*
getRequest("https://github.com/shikkic", function(html) {
    console.log("running process");
    scrapeContributionData(html, function(results) {
        console.log(results);
    });
});

getRequest("https://github.com/shikkic", function(html) {
    scrapeContributionStats(html, function(results) {
        console.log(results);
    });
});*/
