using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IDayPunchRepository : IBasePunchRepository<PunchDto, DayResponse>
    {
        DayResponse GetDay(string userId, double? day, double? month, double? year);
    }
}