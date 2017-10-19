using System;
using TpDotNetCore.Domain.UserConfiguration;

namespace TpDotNetCore.Domain.Punches
{
    public class MonthState
    {
        public string Id { get; set; }

        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }

        public string PunchStateId { get; set; }
        public PunchState PunchState { get; set; }
        public int MonthPunchId { get; set; }
        public MonthPunch MonthPunch { get; set; }
        public int YearPunchId { get; set; }
        public YearPunch YearPunch { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}