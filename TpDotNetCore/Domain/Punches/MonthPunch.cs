using System.Collections.Generic;

namespace TpDotNetCore.Domain.Punches
{
    public class MonthPunch
    {
        public int Id { get; set; }

        public int Month { get; set; }
        
        public List<Punch> Punches { get; set; }
    }
}