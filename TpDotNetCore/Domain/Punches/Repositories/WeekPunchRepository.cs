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

                var response = new WeekResponse();
                response.Status = new OpResult { Success = true };
                response.Punches = new WeekPunchesDto();
                response.Punches.User = user.Id;
                response.Punches.Week = _timeService.GetWeekNumber(dt);
                response.Punches.Year = dt.Year;
                response.Punches.DayPunches = new List<DayPunchesDto>();
                foreach (var dayPunches in punches)
                {
                    var dayPunch = new DayPunchesDto();
                    response.Punches.DayPunches.Add(dayPunch);
                    dayPunch.Punches = new List<PunchDto>();
                    foreach (var punch in dayPunches)
                    {
                        var p1 = new PunchDto();
                        p1.Created = punch.Created;
                        p1.Direction = punch.Direction;
                        p1.Punchid = punch.Id;
                        p1.Time = punch.PunchTime;
                        p1.Timedec = (double)punch.TimeDec;
                        p1.Updated = punch.Updated;
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