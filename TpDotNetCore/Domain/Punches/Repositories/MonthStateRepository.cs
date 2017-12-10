using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class MonthStateRepository : Repository<MonthState, string>, IMonthStateRepository
    {
        public MonthStateRepository(TpContext context) : base(context)
        {
        }

        public MonthState Get(string userId, double? month, double? year)
        {
            var dt = DateTime.Now;
            var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
            var selectedYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

            return Context.MonthStates.Include(m => m.PunchState).SingleOrDefault(p => p.User.Id == userId && p.MonthPunch.Month == selectMonth && p.YearPunch.Year == selectedYear);
        }
    }
}