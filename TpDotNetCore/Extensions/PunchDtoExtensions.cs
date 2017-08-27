using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.Punches;

namespace TpDotNetCore.Extensions
{
    public static class PunchDtoExtensions
    {
        public static void SetPunch(this PunchDto punchDto, Punch punch)
        {
            punchDto.Created = punch.Created;
            punchDto.Direction = punch.Direction;
            punchDto.Punchid = punch.Id;
            punchDto.Time = punch.PunchTime;
            punchDto.Timedec = (double)punch.TimeDec;
            punchDto.Updated = punch.Updated;
        }
    }
}