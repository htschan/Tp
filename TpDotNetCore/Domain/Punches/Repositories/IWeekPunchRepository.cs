using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IWeekPunchRepository : IBasePunchRepository<PunchDto, WeekResponse>
    {
         
    }
}