using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Extensions;
using TpDotNetCore.Helpers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class MonthPunchRepository : Repository<MonthPunch, string>, IMonthPunchRepository
    {
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public MonthPunchRepository(TpContext context,
                ITimeService timeService,
                IAppUserRepository appUserRepository) : base(context)
        {
            _timeService = timeService;
            _appUserRepository = appUserRepository;
        }

        public MonthPunch FindByMonth(int month)
        {
            return Context.MonthPunches.FirstOrDefault(d => d.Month == month);
        }

        public MonthResponse GetMonth(string userId, double? month, double? year)
        {
            try
            {
                var user = _appUserRepository.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
                var selectedYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

                var groupedPunches = Context.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.MonthPunch.Month == selectMonth)
                    .Where(p => p.YearPunch.Year == selectedYear)
                    .GroupBy(p => p.DayPunch.Day)
                    .ToList();

                var response = new MonthResponse
                {
                    Status = new OpResult { Success = true },
                    Punches = new MonthPunchesDto
                    {
                        User = user.Id,
                        Month = selectMonth,
                        Year = selectedYear,
                        Punches = new List<DayPunchesDto>()
                    }
                };
                foreach (var dayPunches in groupedPunches)
                {
                    var dayPunch = new DayPunchesDto();
                    dayPunch.GetRowedDayPunches(dayPunches.OrderBy(dp => dp.TimeDec).ToArray());
                    dayPunch.Day = dayPunches.Key;
                    dayPunch.Month = selectMonth;
                    dayPunch.Year = selectedYear;
                    response.Punches.Punches.Add(dayPunch);
                }
                return response;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"GetCurret month punches threw an exception: {exception.Message}", exception);
            }
        }
    }
}