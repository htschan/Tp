using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Extensions;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class WeekPunchRepository : IWeekPunchRepository
    {
        private readonly TpContext _appDbContext;
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public WeekPunchRepository(TpContext context,
                ITimeService timeService,
                IAppUserRepository appUserRepoistory)
        {
            _appDbContext = context;
            _timeService = timeService;
            _appUserRepository = appUserRepoistory;
        }

        public void Delete(PunchDto entity)
        {
            throw new NotImplementedException();
        }

        public IList<PunchDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public WeekResponse GetWeek(string userId, double? week, double? year)
        {
            try
            {
                var user = _appUserRepository.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var selectWeek = week.HasValue ? Convert.ToInt32(week) : _timeService.GetWeekNumber(dt);
                var selectYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

                var punches = _appDbContext.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.WeekPunch.Week == selectWeek)
                    .Where(p => p.YearPunch.Year == dt.Year)
                    .GroupBy(p => p.DayPunch.Day)
                    .ToList();

                var response = new WeekResponse
                {
                    Status = new OpResult { Success = true },
                    Punches = new WeekPunchesDto
                    {
                        User = user.Id,
                        Week = selectWeek,
                        Year = selectYear,
                        DayPunches = new List<DayPunchesDto>()
                    }
                };
                foreach (var dayPunches in punches)
                {
                    var dayPunch = new DayPunchesDto();
                    dayPunch.GetRowedDayPunches(dayPunches.OrderBy(dp => dp.TimeDec).ToArray());
                    dayPunch.Day = dayPunches.Key;
                    var p0 = dayPunch.Punches.FirstOrDefault();
                    dayPunch.Month = p0 != null ? p0.Enter != null ? p0.Enter.Time.Value.Month : p0.Leave != null ? p0.Leave.Time.Value.Month : dt.Month : dt.Month;
                    dayPunch.Year = selectYear;
                    response.Punches.DayPunches.Add(dayPunch);
                }
                return response;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (System.Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"GetCurret week punches threw an exception: {exception.Message}", exception);
            }
        }

        public void Insert(PunchDto entity)
        {
            throw new NotImplementedException();
        }

        public void Update(PunchDto entity)
        {
            throw new NotImplementedException();
        }
    }
}