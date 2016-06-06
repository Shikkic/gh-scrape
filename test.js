const gh = require('./index');
gh.scrapeContributionDataAndStats('https://github.com/KCreate', (data) => {

    let longestStreak = 0;
    let lastDay = '0-0-0';

    // Reduce the total number of contributions to a single integer
    const totalContributions = data.contributionData.reduce((last, current, index) => {

        // Calculate the exptected day to continue the streak
        let expectedDay = new Date(lastDay);
        expectedDay.setDate(expectedDay.getDate() + 1); // Increment day by 1

        const year = expectedDay.getFullYear();
        let month = expectedDay.getMonth() + 1; // The month starts from zero
        let day = expectedDay.getDate();

        // Left-pad for noobs
        if (month < 10) { month = '0' + month; }
        if (day < 10) { day = '0' + day; }

        expectedDay = (
            year + '-' +
            month + '-' +
            day
        );
        console.log(expectedDay, current.dataDate);

        // If the streak was continued, increment, else reset
        if (expectedDay === current.dataDate) {
            longestStreak++;
        } else {
            longestStreak = 0;
        }

        // Update the last day
        lastDay = current.dataDate;

        return last + current.dataContributionCount;
    }, 0);

    console.log('total contributions: ' + totalContributions);
    console.log('longest streak: ' + longestStreak);
});
