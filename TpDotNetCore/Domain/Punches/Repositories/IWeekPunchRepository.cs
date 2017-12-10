using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IWeekPunchRepository : IBasePunchRepository<WeekPunch, WeekResponse, string>
    {
        WeekResponse GetWeek(string userId, double? week, double? year);
    }
}