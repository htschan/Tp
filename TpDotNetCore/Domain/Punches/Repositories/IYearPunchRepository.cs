using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IYearPunchRepository : IBasePunchRepository<YearPunch, YearResponse, string>
    {
        YearResponse GetYear(string userId, double? year);
        YearPunch FindByYear(int year);
    }
}