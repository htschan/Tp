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
    public class MonthPunchRepository : IMonthPunchRepository
    {
        private readonly TpContext _appDbContext;
        private readonly ITimeService _timeService;
        private readonly IAppUserRepository _appUserRepository;

        public MonthPunchRepository(TpContext context,
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

        public MonthResponse GetCurrent(string userId)
        {
            try
            {
                var user = _appUserRepository.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var groupedPunches = _appDbContext.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.MonthPunch.Month == dt.Month)
                    .Where(p => p.YearPunch.Year == dt.Year)
                    .GroupBy(p => p.DayPunch.Day)
                    .ToList();

                var response = new MonthResponse
                {
                    Status = new OpResult { Success = true },
                    Punches = new MonthPunchesDto
                    {
                        User = user.Id,
                        Month = dt.Month,
                        Year = dt.Year,
                        Punches = new List<DayPunchesDto>()
                    }
                };
                foreach (var dayPunches in groupedPunches)
                {
                    var dayPunch = new DayPunchesDto();
                    dayPunch.GetRowedDayPunches(dayPunches.OrderBy(dp => dp.TimeDec).ToArray());
                    dayPunch.Day = dayPunches.Key;
                    dayPunch.Month = dt.Month;
                    dayPunch.Year = dt.Year;
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