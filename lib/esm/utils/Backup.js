export class Backup {
    static keepBackup(date, now = new Date(), keepConfig = {
        hourlyThreshold: 60 * 60 * 1000, //1 hour
        sixHoursThreshold: 3 * 24 * 60 * 60 * 1000, //3 days
        weeklyThreshold: 14 * 24 * 60 * 60 * 1000, //14 days
        monthlyThreshold: 90 * 24 * 60 * 60 * 1000, //90 days
    }) {
        //if the backup is longer then one hour ago
        if (now.getTime() - date.getTime() > keepConfig.hourlyThreshold) {
            //keep only the first backup of each hour (minute = 0)
            if (date.getMinutes() !== 0) {
                return false;
            }
        }
        //if the backup is longer then 3 days ago.
        if (now.getTime() - date.getTime() > keepConfig.sixHoursThreshold) {
            //keep only one backup per 6 hours
            if (date.getHours() !== 0 &&
                date.getHours() !== 6 &&
                date.getHours() !== 12 &&
                date.getHours() !== 18) {
                return false;
            }
        }
        //if the backup is older then the weekly threshold
        if (now.getTime() - date.getTime() > keepConfig.weeklyThreshold) {
            //keep only the first backup of each week (day = 0)
            if (date.getDay() !== 0) {
                return false;
            }
        }
        //if the backup is longer then 90 days ago (~3 months)
        if (now.getTime() - date.getTime() > 90 * 24 * 60 * 60 * 1000) {
            //keep only the first backup of each month (day = 1)
            if (date.getDate() !== 1) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=Backup.js.map