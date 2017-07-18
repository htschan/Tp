using System.Collections.Generic;

namespace TpDotNetCore.Domain.Punches
{
    public class DayPunch
    {
        public int Id { get; set; }
        
        public int Day { get; set; }
        
        public List<Punch> Punches { get; set; }
    }
}