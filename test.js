const gh = require('./index');
const url = 'https://github.com/KCreate';

gh.scrapeContributionDataAndStats(url, (data) => {
    if (Object.keys(data.statsData).length > 0) {
        console.log('[ OK ] Test 1 passed!');
    } else {
        console.log('[ FAIL ] Test 1 failed!');
    }

    console.log(data);
});


// These just fail if they are being run.
// The implementation is supposed to show a deprecation warning
gh.scrapeContributionData(url, (data) => {
    console.log('[ FAIL ] Test 2 failed');
});
gh.scrapeContributionStats(url, (data) => {
    console.log('[ FAIL ] Test 3 failed');
});
