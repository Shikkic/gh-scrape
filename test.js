const gh = require('./index');
gh.scrapeContributionDataAndStats('https://github.com/KCreate', (data) => {
    if (Object.keys(data.statsData).length > 0) {
        console.log('[ OK ] Test passed!');
    } else {
        console.log('[ FAIL ] Test failed!');
    }
});
