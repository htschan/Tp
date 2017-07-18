using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IYearPunchRepository : IBasePunchRepository<PunchDto, YearResponse>
    {
         
    }
}