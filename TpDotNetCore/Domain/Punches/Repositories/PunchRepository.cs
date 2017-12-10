using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class PunchRepository : Repository<Punch, string>, IPunchRepository
    {
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public PunchRepository(TpContext context,
                ITimeService timeService,
                IAppUserRepository appUserRepository) : base(context)
        {
            _timeService = timeService;
            _appUserRepository = appUserRepository;
        }
        public void Punch(string userId, bool direction)
        {
            try
            {
                var user = _appUserRepository.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var day = Context.DayPunches.FirstOrDefault(d => d.Day == dt.Day);
                var week = Context.WeekPunches.FirstOrDefault(d => d.Week == _timeService.GetWeekNumber(dt));
                var month = Context.MonthPunches.FirstOrDefault(d => d.Month == dt.Month);
                var year = Context.YearPunches.FirstOrDefault(d => d.Year == dt.Year);
                var punch = new Punch
                {
                    PunchTime = dt,
                    TimeDec = _timeService.GetDecimalHour(dt),
                    Direction = direction,
                    DayPunch = day,
                    WeekPunch = week,
                    MonthPunch = month,
                    YearPunch = year,
                    User = user,
                    Created = DateTime.Now,
                    Updated = DateTime.MinValue
                };
                Context.Punches.Add(punch);
                Context.SaveChanges();
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"Punch threw an exception: {exception.Message}", exception);
            }
        }

        public Punch GetByUser(Punch punch, AppUser user)
        {
            return Context.Punches.AsNoTracking().FirstOrDefault(u => u.Id == punch.Id && u.UserId == user.Id);
        }
    }
}