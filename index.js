var request = require('request'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    moment = require('moment');

// Export Scrape Profile Data and Stats function
exports.scrapeContributionDataAndStats = function(url, callback) {
    var returnObj = {};
    getRequest(url, function(html) {
        scrapeContributionData(html, function(contributionData) {
            returnObj = formatReturnData(contributionData, deriveContributionStats(contributionData));
            callback(returnObj);
        });
    });
};

// Helper functions
function deriveContributionStats(contributionData) {

    // Some variables
    var longestStreak = 0;
    var currentStreak = 0;
    var lastDay = '0-0-0';

    // Reduce the total number of contributions to a single integer
    const totalContributions = contributionData.reduce(function (last, current, index) {

        // Calculate the exptected day to continue the streak
        var expectedDay = new Date(lastDay);
        expectedDay.setDate(expectedDay.getDate() + 1); // Increment day by 1

        const year = expectedDay.getFullYear();
        var month = expectedDay.getMonth() + 1; // The month starts from zero
        var day = expectedDay.getDate();

        // Left-pad for noobs
        if (month < 10) { month = '0' + month; }
        if (day < 10) { day = '0' + day; }

        expectedDay = (
            year + '-' +
            month + '-' +
            day
        );

        // If the streak was continued, increment, else reset
        if (expectedDay === current.dataDate) {
            currentStreak++;
        } else {
            currentStreak = 0;
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

        // Update the last day
        lastDay = current.dataDate;

        return last + current.dataContributionCount;
    }, 0);

    return {
        totalContributions: totalContributions,
        longestStreak: longestStreak,
        currentStreak: currentStreak
    };
}

function formatReturnData(contributionData, statsData) {
    var commitsToday = getCommitsToday(contributionData);
    var returnData = {contributionData: contributionData, statsData: statsData, commitsToday: commitsToday};
    return commitsToday == null ? null : returnData;
};

function getCommitsToday(contributionData) {
    if (!contributionData) {
        return null;
    }

    // Grab lastest commit data
    var latestCommits = _.last(contributionData),
        latestCommitsDate = moment(latestCommits.dataDate).dayOfYear(),
        todaysDate = moment().dayOfYear();

    // Check if the lastest commit data is from today or not
    if (latestCommitsDate === todaysDate) {
        return latestCommits.dataContributionCount;
    }

    return 0;
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
        var dataContributionCount = parseInt(commitData.attribs['data-count']),
            dataDate = commitData.attribs['data-date'],
            commitDataObj = {};

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
        return error;
    });
};

// Deprecated warnings
exports.scrapeContributionData = function() {
    console.log('Deprecation warning: scrapeContributionData has been deprecated in favor of just using scrapeContributionDataAndStats.');
};
exports.scrapeContributionStats = function() {
    console.log('Deprecation warning: scrapeContributionData has been deprecated in favor of just using scrapeContributionDataAndStats.');
};
