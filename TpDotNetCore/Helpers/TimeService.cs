using System;
using System.Globalization;

namespace TpDotNetCore.Helpers
{
    public class TimeService : ITimeService
    {
        public decimal GetDecimalHour(DateTime dt)
        {
            return (decimal)dt.Hour + (decimal)(dt.Minute / 60.0) + (decimal)(dt.Second / 3600.0);
        }
        public int GetWeekNumber(DateTime dt)
        {
            CultureInfo ciCurr = CultureInfo.CurrentCulture;
            int weekNum = ciCurr.Calendar.GetWeekOfYear(dt, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            return weekNum;
        }
    }
}