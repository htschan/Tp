using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IMonthPunchRepository : IBasePunchRepository<PunchDto, MonthResponse>
    {
         
    }
}