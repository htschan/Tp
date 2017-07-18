using System.Collections.Generic;

namespace TpDotNetCore.Domain.Punches
{
    public class WeekPunch
    {
        public int Id { get; set; }
        
        public int Week { get; set; }
        
        public List<Punch> Punches { get; set; }
    }
}