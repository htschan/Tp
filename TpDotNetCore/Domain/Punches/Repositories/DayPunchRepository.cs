using System;
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
    public class DayPunchRepository : Repository<DayPunch, string>, IDayPunchRepository
    {
        private readonly IAppUserRepository _appUserRepository;
        public DayPunchRepository(TpContext context, IAppUserRepository appUserRepository) : base(context)
        {
            _appUserRepository = appUserRepository;
        }

        public DayResponse GetDay(string userId, double? day, double? month, double? year)
        {
            try
            {
                var user = _appUserRepository.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var selectDay = day.HasValue ? Convert.ToInt32(day) : dt.Day;
                var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
                var selectYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

                var punches = Context.Punches
                    .Where(p => p.User.Id == user.Id)
                    .Where(p => p.DayPunch.Day == selectDay)
                    .Where(p => p.MonthPunch.Month == selectMonth)
                    .Where(p => p.YearPunch.Year == selectYear)
                    .ToList();
                var response = new DayResponse
                {
                    Status = new OpResult { Success = true },
                };

                var dayPunch = new DayPunchesDto();
                dayPunch.GetRowedDayPunches(punches.OrderBy(dp => dp.TimeDec).ToArray());
                dayPunch.Day = selectDay;
                dayPunch.Month = selectMonth;
                dayPunch.Year = selectYear;
                response.Punches = dayPunch;
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
    }
}