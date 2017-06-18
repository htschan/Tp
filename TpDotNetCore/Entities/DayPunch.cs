using System.Collections.Generic;

namespace TpDotNetCore.Entities
{
    public class DayPunch
    {
        public int Id { get; set; }
        
        public int Day { get; set; }
        
        public List<Punch> Punches { get; set; }
    }
}