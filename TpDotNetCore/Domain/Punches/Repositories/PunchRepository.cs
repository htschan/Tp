using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class PunchRepository : IPunchRepository
    {
        private readonly TpContext _appDbContext;
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public PunchRepository(TpContext context,
                ITimeService timeService,
                IAppUserRepository appUserRepository)
        {
            _appDbContext = context;
            _timeService = timeService;
            _appUserRepository = appUserRepository;
        }

        public void Delete(Punch entity)
        {
            throw new NotImplementedException();
        }

        public IList<Punch> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Insert(Punch entity)
        {
            throw new NotImplementedException();
        }

        public void Punch(string userId, bool direction)
        {
            try
            {
                var user = _appUserRepository.FindByName(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var day = _appDbContext.DayPunches.FirstOrDefault(d => d.Day == dt.Day);
                var week = _appDbContext.WeekPunches.FirstOrDefault(d => d.Week == _timeService.GetWeekNumber(dt));
                var month = _appDbContext.MonthPunches.FirstOrDefault(d => d.Month == dt.Month);
                var year = _appDbContext.YearPunches.FirstOrDefault(d => d.Year == dt.Year);
                var punch = new Domain.Punches.Punch
                {
                    PunchTime = dt,
                    TimeDec = _timeService.GetDecimalHour(dt),
                    Direction = true,
                    DayPunch = day,
                    WeekPunch = week,
                    MonthPunch = month,
                    YearPunch = year,
                    User = user,
                    Created = DateTime.Now,
                    Updated = DateTime.MinValue
                };
                _appDbContext.Punches.Add(punch);
                _appDbContext.SaveChanges();
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (System.Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"Punch threw an exception: {exception.Message}", exception);
            }
        }

        public void Update(Punch entity)
        {
            throw new NotImplementedException();
        }
    }
}