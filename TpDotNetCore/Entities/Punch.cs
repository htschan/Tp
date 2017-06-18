using System;

namespace TpDotNetCore.Entities
{
    public class Punch
    {
        public string Id { get; set; }

        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        
        public DateTime PunchTime { get; set; }
        public decimal TimeDec { get; set; }
        public bool Direction { get; set; } // true: In, false: Out

        public int DayPunchId { get; set; }
        public DayPunch DayPunch { get; set; }
        public int WeekPunchId { get; set; }
        public WeekPunch WeekPunch { get; set; }
        public int MonthPunchId { get; set; }
        public MonthPunch MonthPunch { get; set; }
        public int YearPunchId { get; set; }
        public YearPunch YearPunch { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}