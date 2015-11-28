var request = require('request'),
    underscore = require('underscore'),
    cheerio = require('cheerio');

function scrapeCon(html, callback) {
    console.log("made it to the begining");
    var user = {},
        j = 0,
        z = 0,
        index = 0,
        character = '',
        word = "",
        found = false,
        len = html.length - 1;

    for (i = 0; i < len; i++) {
        // Loop over every char on the page
        character = html[i];
        // Finding Contributions in the last year
        if (character === 'C') {
            index = i + 30;
            word = html.slice(i, index);
            // Contributions in the last year
            if (word === "Contributions in the last year") {
                j = i + 30;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j + 14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.total = word;
                            //console.log("total = ", user.total);
                        }
                    }
                    j++;
                }
            }
            index = i + 14;
            word = html.slice(i, index);
            if (word === "Current streak") {
                j = i + 14;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j + 14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.currentStreak = word;
                            //console.log("Current streak = ", user.currentStreak);
                        }
                    }
                    j++;
                } 
            }
        }
        // Finding Longest Streak
        if (character === 'L') {
            index = i + 14;
            word = html.slice(i, index); 
            if (word === 'Longest streak') {
                j = i + 15;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j +14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.longestStreak = word;
                            //console.log("Longest Streak = ", user.streak);
                        }
                    }
                    j++;
                }
            }
        }
    }
    callback(user);
};


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


function scrapeContributions(html, callback) {
    $ = cheerio.load(html);
    var commitDataArray = [];

    $('rect').each(function(index, commitData) {
        // Look for our contribtion data
        var dataContributionCount = commitData.attribs['data-count'];
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
        console.log("returning Array");
        callback(commitDataArray);
    } else {
        // If it fails validation return null
        callback(null);
    }
}; 

// Test for scrape Con
getRequest("https://github.com/shikkic", function(html) {
    console.log("running process");
    scrapeContributions(html, function(results) {
        console.log(results);
    });
});

/*exports.scrape = function (url, callback) {
    getRequest(url, function(data) {
        data = data.toString();
        scrapeCon(data, function(results){
            callback(results);
        });
    });
};*/

/*
exports.scrapeCommits = function (url, callback) {
    getRequest(url, function(html) {
        console.log("running process");
        scrapeContributions(html, function(results) {
            console.log(results);
        });
    });
};*/
