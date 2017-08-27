using TpDotNetCore.Controllers;

namespace TpDotNetCore.Extensions
{
    public static class PunchRowDtoExtensions
    {
        public static double GetRowTotal(this PunchRowDto punchRowDto)
        {
            if (punchRowDto.Enter != null && punchRowDto.Leave != null)
            {
                punchRowDto.RowTotal = punchRowDto.Leave.Timedec.Value - punchRowDto.Enter.Timedec.Value;
                return punchRowDto.RowTotal.Value;
            }
            return 0.0;
        }
    }
}