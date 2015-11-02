var request = require('request'),
    underscore = require('underscore');

/*
function scrapeProfileDetails(html, callback) {
    var j = 0;
    var user = {};
    for(var i = 0; i < html.length -1; i++) {
        var character = html[i].toString();
        // Parse for worksFor
        if (character === 'w') {
            var word = html.slice(i, i + 8);
            if (word === "worksFor") {
                var workTitle = '';
                j = i + 17;
                while (html[j] != '\"') {
                    workTitle += html[j];
                    j++;
                }
                //console.log("work title = " + workTitle);
                user.workTitle = workTitle;
            }
        }
        // Parse for homeLocation
        if (character === 'h') {
            //console.log("found an h");
            var word = html.slice(i, i + 12);
            if (word === "homeLocation") {
                var homeLocation = '';
                j = i + 21;
                while (html[j] != '\"') {
                    homeLocation += html[j];
                    j++;
                }
                //console.log("home location = " + homeLocation);
                user.homeLocation = homeLocation;
            }
        }
        // Parse for email
        if (character === 'e') {
            var word = html.slice(i, i + 5);
            if (word === "email") {
                var email = '';
                j = i;
                while (html[j] != '>') {
                    j++;
                }
                j++;
                while (html[j] != '<') {
                    email += html[j];
                    j++;
                }
                //console.log("email = "+email);
                user.email = email;
            }
        }
        if (character === 'e') {
            var word = html.slice(i, i + 5);
            if (word === "email")
                user.email = findValue(html, i);
        }
        // Parse For Join Date
        if (character === 'j') {
            var word = html.slice(i, i + 9);
            if (word === "join-date") {
                var joinDate = "";
                j = i;
                while (html[j] != '>') {
                    j++;
                }
                j++;
                while (html[j] != '<') {
                    joinDate += html[j];
                    j++;
                }
                //console.log("joinDate = "+joinDate);
                user.joinDate = joinDate
            }
        }
        // Pare For Url
        if (character === 'i') {
            var word = html.slice(i, i + 14);
            if (word === 'itemprop="url"') {
                var url = '';
                j = i;
                while (html.slice(j, j+4) != 'href') {
                    j++;
                }
                while (html[j] != '>') {
                    j++;
                }
                j++;
                while (html[j] != '<') {
                    url += html[j];
                    j++;
                }
                //console.log(url);
                user.url = url;
            }
        }
    }
    callback(user);
};*/

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

function scrapeCommits(html, callback) {
    var data = [],
        j = 0,
        z = 0,
        index = 0,
        character = '',
        word = "",
        found = false,
        len = html.length - 1;

    for (i = 0; i < len ;i++) {
        var character = html[i];
        // Look for starting tag identifer 
        if (character  === '<') {
            word = html.slice(i, i + 5);
            // Check if it's a '<rect'
            if (word === '<rect') {
                // loop until not the end of the doc and the rest of the word  
                var endWord = html.slice(i, i + 5);
                var endTag = '/>';
                var j = i;
                var newData = {};

                // Loop until we hit closing tag '/>
                while (endWord !== endTag) {

                    // reset character
                    character = html[j];
                    // checking for beginings of 'data-count' or 'data source'.
                    if (character === 'd') {
                        //console.log(html.slice(j, j + 10));
                        var dataCountString = html.slice(j, j + 10);
                        // CASE 1 'data-count'
                        if (dataCountString === 'data-count') {
                            // Loop through until you hit the " and add data to obj
                            var z = j + 12;
                            var dataCountNumber = "";
                            character = html[z];
                            while (character !== '"') {
                                dataCountNumber += character;
                                z++;
                                character = html[z];
                            }
                            //console.log(dataCountNumber);
                            newData.commits = dataCountNumber;
                        }
                        //CASE 2 'data-date'
                        var dataDateString = html.slice(j, j + 9);
                        if (dataDateString === 'data-date') {
                           var z = j + 11; 
                           var dateValue = "";
                           character = html[z];
                           while (character !== '"') {
                                dateValue += character;
                                z++;
                                character = html[z];
                           }
                           newData.date = dateValue;
                        }
                    }
                    j++;
                    endWord = html.slice(j, j + 2);
                }
                data.push(newData);
            } 
        }
    }
    callback(data);
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

/* Test for scrape Con
getRequest("https://github.com/shikkic", function(data) {
    console.log("running process");
    data = data.toString();
    scrapeCon(data, function(results) {
        console.log(results);
    });
});
*/
/* Test for scrape Con
getRequest("https://github.com/shikkic", function(data) {
    console.log("running process");
    data = data.toString();
    scrapeCommits(data, function(results) {
        console.log(results);
    });
});
*/

exports.scrape = function (url, callback) {
    getRequest(url, function(data) {
        data = data.toString();
        scrapeCon(data, function(results){
            callback(results);
        });
    });
};

exports.scrapeCommits = function (url, callback) {
    getRequest(url, function(data) {
        data = data.toString();
        scrapeCommits(data, function(results){
            callback(results);
        });
    });
};
