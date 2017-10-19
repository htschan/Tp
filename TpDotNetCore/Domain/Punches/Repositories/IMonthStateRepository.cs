using TpDotNetCore.Controllers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IMonthStateRepository : IRepository<MonthState>
    {
        MonthState Get(string userId, double? month, double? year);
    }
}