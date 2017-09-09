using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IWeekPunchRepository : IBasePunchRepository<PunchDto, WeekResponse>
    {
        WeekResponse GetWeek(string userId, double? week, double? year);
    }
}