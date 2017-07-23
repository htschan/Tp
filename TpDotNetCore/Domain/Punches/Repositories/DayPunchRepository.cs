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
    public class DayPunchRepository : IDayPunchRepository
    {
        private readonly TpContext _appDbContext;
        private readonly IAppUserRepository _appUserRepository;

        public DayPunchRepository(TpContext context,
                IAppUserRepository appUserRepository)
        {
            _appDbContext = context;
            _appUserRepository = appUserRepository;
        }

        public void Delete(PunchDto entity)
        {
            throw new NotImplementedException();
        }

        public IList<PunchDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public DayResponse GetCurrent(string userId)
        {
            try
            {
                var user = _appUserRepository.FindByName(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var punches = _appDbContext.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.DayPunch.Day == dt.Day)
                    .Where(p => p.MonthPunch.Month == dt.Month)
                    .Where(p => p.YearPunch.Year == dt.Year)
                    .ToList();
                var response = new DayResponse
                {
                    Status = new OpResult {Success = true},
                    Punches = new DayPunchesDto
                    {
                        Userboid = user.Id,
                        Day = dt.Day,
                        Month = dt.Month,
                        Year = dt.Year,
                        Daytotal = 12.12,
                        Punches = new List<PunchDto>()
                    }
                };
                foreach (var punch in punches)
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
                    response.Punches.Punches.Add(p1);
                }
                return response;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"GetCurret day punches threw an exception: {exception.Message}", exception);
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