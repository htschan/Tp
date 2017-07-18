using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IDayPunchRepository : IBasePunchRepository<PunchDto, DayResponse>
    {

    }
}