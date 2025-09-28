export const summaryData = [
    { title: "Hours This Week", value: "32.5", change: "+5.2%", changeType: "positive" },
    { title: "Upcoming Time Off", value: "2 days", change: "Next: July 25", changeType: "neutral" },
    { title: "Overtime Hours", value: "4.5", change: "-1.0%", changeType: "negative" },
    { title: "Pending Approvals", value: "3", change: "Absence Requests", changeType: "neutral" },
];

export const absenceData = [
  { id: "ABS001", employee: "Alice Johnson", startDate: "2024-07-25", endDate: "2024-07-26", type: "Vacation", status: "Approved" },
  { id: "ABS002", employee: "Bob Williams", startDate: "2024-08-01", endDate: "2024-08-01", type: "Sick Leave", status: "Pending" },
  { id: "ABS003", employee: "Charlie Brown", startDate: "2024-07-22", endDate: "2024-07-22", type: "Personal", status: "Denied" },
  { id: "ABS004", employee: "Diana Miller", startDate: "2024-08-05", endDate: "2024-08-09", type: "Vacation", status: "Pending" },
  { id: "ABS005", employee: "Ethan Davis", startDate: "2024-07-29", endDate: "2024-07-29", type: "Sick Leave", status: "Approved" },
  { id: "ABS006", employee: "Fiona Garcia", startDate: "2024-08-12", endDate: "2024-08-12", type: "Personal", status: "Pending" },
];

export const attendanceReportData = [
  { date: "Jul 15", Present: 95, Absent: 5 },
  { date: "Jul 16", Present: 98, Absent: 2 },
  { date: "Jul 17", Present: 97, Absent: 3 },
  { date: "Jul 18", Present: 94, Absent: 6 },
  { date: "Jul 19", Present: 99, Absent: 1 },
  { date: "Jul 22", Present: 96, Absent: 4 },
  { date: "Jul 23", Present: 100, Absent: 0 },
];

export const timeOffReportData = [
    { type: "Vacation", count: 45, fill: "hsl(var(--chart-1))" },
    { type: "Sick Leave", count: 30, fill: "hsl(var(--chart-2))" },
    { type: "Personal", count: 15, fill: "hsl(var(--chart-4))" },
    { type: "Unpaid", count: 10, fill: "hsl(var(--chart-5))" },
];

export const initialTimecardData = `{
    "employeeId": "EMP123",
    "payPeriod": "2024-07-01_2024-07-15",
    "entries": [
        "2024-07-08: IN 09:01, OUT 17:03",
        "2024-07-09: 09:00 AM to 05:00 PM",
        "2024-07-10 08:55-17:05",
        {"date": "2024-07-11", "start": "09:05", "end": "16:58"},
        "July 12, 2024 - 9 to 5"
    ]
}`;
