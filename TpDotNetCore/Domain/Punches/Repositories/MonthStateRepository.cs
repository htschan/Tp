using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class MonthStateRepository : IMonthStateRepository
    {
        private readonly TpContext _context;
        public MonthStateRepository(TpContext context)
        {
            _context = context;
        }

        public void Delete(MonthState entity)
        {
            throw new System.NotImplementedException();
        }

        public MonthState Get(string userId, double? month, double? year)
        {
            var dt = DateTime.Now;
            var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
            var selectedYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

            return _context.MonthStates.Include(m => m.PunchState).SingleOrDefault(p => p.User.Id == userId && p.MonthPunch.Month == selectMonth && p.YearPunch.Year == selectedYear);
        }

        public IList<MonthState> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public void Insert(MonthState entity)
        {
            entity.Id = Guid.NewGuid().ToString();
            _context.MonthStates.Add(entity);
            _context.SaveChanges();
        }

        public void Update(MonthState entity)
        {
            _context.MonthStates.Update(entity);
            _context.SaveChanges();
        }
    }
}