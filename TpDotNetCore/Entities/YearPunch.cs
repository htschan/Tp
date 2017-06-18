using System.Collections.Generic;

namespace TpDotNetCore.Entities
{
    public class YearPunch
    {
        public int Id { get; set; }

        public int Year { get; set; }

        public List<Punch> Punches { get; set; }
    }
}