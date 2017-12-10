using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IMonthPunchRepository : IBasePunchRepository<MonthPunch, MonthResponse, string>
    {
        MonthResponse GetMonth(string userId, double? month, double? year);
        MonthPunch FindByMonth(int month);
    }
}