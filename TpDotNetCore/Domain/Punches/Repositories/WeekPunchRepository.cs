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

        public WeekResponse GetCurrent(string userId)
        {
            try
            {
                var user = _appUserRepository.FindByName(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var punches = _appDbContext.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.WeekPunch.Week == _timeService.GetWeekNumber(dt))
                    .Where(p => p.YearPunch.Year == dt.Year)
                    .GroupBy(p => p.DayPunch.Day)
                    .ToList();

                var response = new WeekResponse
                {
                    Status = new OpResult {Success = true},
                    Punches = new WeekPunchesDto
                    {
                        User = user.Id,
                        Week = _timeService.GetWeekNumber(dt),
                        Year = dt.Year,
                        DayPunches = new List<DayPunchesDto>()
                    }
                };
                foreach (var dayPunches in punches)
                {
                    var dayPunch = new DayPunchesDto();
                    response.Punches.DayPunches.Add(dayPunch);
                    dayPunch.Punches = new List<PunchDto>();
                    foreach (var punch in dayPunches)
                    {
                        var p1 = new PunchDto
                        {
                            Created = punch.Created,
                            Direction = punch.Direction,
                            Punchid = punch.Id,
                            Time = punch.PunchTime,
                            Timedec = (double) punch.TimeDec,
                            Updated = punch.Updated
                        };
                        dayPunch.Punches.Add(p1);
                    }
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