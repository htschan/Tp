using System.Collections.Generic;

namespace TpDotNetCore.Entities
{
    public class WeekPunch
    {
        public int Id { get; set; }
        
        public int Week { get; set; }
        
        public List<Punch> Punches { get; set; }
    }
}