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
    public class YearPunchRepository : IYearPunchRepository
    {
        private readonly TpContext _appDbContext;
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public YearPunchRepository(TpContext context,
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

        public YearResponse GetCurrent(string userId)
        {
            try
            {
                var user = _appUserRepository.FindByName(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var punches = _appDbContext.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.YearPunch.Year == dt.Year)
                    .OrderBy(p => p.MonthPunch.Month)
                    .GroupBy(p => p.MonthPunch.Month)
                    .Select(p => new
                    {
                        Month = p.Key,
                        Groups = p.OrderBy(q => q.DayPunch.Day).GroupBy(q => q.DayPunch.Day)
                    });

                var response = new YearResponse { Status = new OpResult { Success = true } };
                var yearchPunchVm = new YearPunchesDto();
                response.Punches = yearchPunchVm;
                yearchPunchVm.User = user.Id;
                yearchPunchVm.Year = dt.Year;
                yearchPunchVm.Punches = new List<MonthPunchesDto>();
                foreach (var x in punches)
                {
                    var monthPunchDto = new MonthPunchesDto();
                    yearchPunchVm.Punches.Add(monthPunchDto);
                    monthPunchDto.User = user.Id;
                    monthPunchDto.Month = x.Month;
                    monthPunchDto.Year = dt.Year;
                    monthPunchDto.Punches = new List<DayPunchesDto>();

                    foreach (var dayPunches in x.Groups)
                    {
                        var dayPunch = new DayPunchesDto();
                        monthPunchDto.Punches.Add(dayPunch);
                        dayPunch.Punches = new List<PunchDto>();
                        foreach (var punch in dayPunches.OrderBy(p => p.PunchTime))
                        {
                            Console.WriteLine(punch.DayPunch);
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
                }
                return response;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"GetCurret year punches threw an exception: {exception.Message}", exception);
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