using System;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.Punches.Repositories;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.Punches
{
    public class PunchService : IPunchService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PunchService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        public void UpdatePunch(Punch punchEntity, string userId)
        {
            var user = _unitOfWork.AppUsers.FindByName(userId);
            if (user == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");
            var punch = _unitOfWork.Punches.GetByUser(punchEntity, user);
            if (punch == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"Punch {punchEntity.Id} of User {userId} not found");
            _unitOfWork.Punches.Update(punchEntity);
        }

        public void DeletePunch(Punch punchEntity, string userId)
        {
            var user = _unitOfWork.AppUsers.FindByName(userId);
            if (user == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");
            var punch = _unitOfWork.Punches.GetByUser(punchEntity, user);
            if (punch == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"Punch {punchEntity.Id} of User {userId} not found");
            _unitOfWork.Punches.Remove(punchEntity);
        }

        public MonthState SetMonthState(string userId, double? month, double? year, StatusAdminDtoStatus state)
        {
            try
            {
                var user = _unitOfWork.AppUsers.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
                var selectedYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

                var punchState = _unitOfWork.PunchStates.GetByValue(state);
                var monthState = _unitOfWork.MonthStates.Get(userId, selectMonth, selectedYear);
                if (monthState == null)
                {
                    var monthPunch = _unitOfWork.MonthPunches.FindByMonth(selectMonth);
                    var yearPunch = _unitOfWork.YearPunches.FindByYear(selectedYear);
                    monthState = new MonthState
                    {
                        MonthPunch = monthPunch,
                        YearPunch = yearPunch,
                        User = user,
                        PunchState = punchState,
                        Created = DateTime.Now,
                        Updated = DateTime.Now
                    };
                    _unitOfWork.MonthStates.Add(monthState);
                }
                else
                {
                    monthState.PunchState = punchState;
                    monthState.Updated = DateTime.Now;
                    _unitOfWork.MonthStates.Update(monthState);
                }
                return monthState;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"{nameof(SetMonthState)} threw an exception: {exception.Message}", exception);
            }
        }

        public StatusAdminDto GetMonthState(string userId, double? month, double? year)
        {
            try
            {
                var user = _unitOfWork.AppUsers.FindById(userId);
                if (user == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");

                var dt = DateTime.Now;
                var selectMonth = month.HasValue ? Convert.ToInt32(month) : dt.Month;
                var selectedYear = year.HasValue ? Convert.ToInt32(year) : dt.Year;

                var monthState = _unitOfWork.MonthStates.Get(userId, selectMonth, selectedYear);
                if (monthState == null || monthState.PunchState == null)
                {
                    monthState = SetMonthState(userId, month, year, StatusAdminDtoStatus.Open);
                }
                var st = (StatusAdminDtoStatus)Enum.Parse(typeof(StatusAdminDtoStatus), monthState.PunchState.State);
                return new StatusAdminDto { Userid = userId, Month = selectMonth, Year = selectedYear, Status = st };
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"{nameof(SetMonthState)} threw an exception: {exception.Message}", exception);
            }
        }

        public MonthResponse GetMonth(string userId, double? month, double? year)
        {
            try
            {
                var monthResponse = _unitOfWork.MonthPunches.GetMonth(userId, month, year);
                monthResponse.Punches.State = GetMonthState(userId, month, year);
                return monthResponse;
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