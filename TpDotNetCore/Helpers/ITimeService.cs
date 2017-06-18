using System;

namespace TpDotNetCore.Helpers
{
    public interface ITimeService
    {
        decimal GetDecimalHour(DateTime dt);
        int GetWeekNumber(DateTime dt);
    }
}