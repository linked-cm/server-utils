export declare class Backup {
    static keepBackup(date: Date, now?: Date, keepConfig?: {
        hourlyThreshold: number;
        sixHoursThreshold: number;
        weeklyThreshold: number;
        monthlyThreshold: number;
    }): boolean;
}
