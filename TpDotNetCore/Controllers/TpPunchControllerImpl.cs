using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.Punches;
using TpDotNetCore.Domain;
using Common.Communication;
using System.Collections.ObjectModel;

namespace TpDotNetCore.Controllers
{
    public class TpPunchControllerImpl : TpBaseControllerImpl, ITpPunchController
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPunchService _punchService;
        private readonly IUnitOfWork _unitOfWork;

        public TpPunchControllerImpl(IMapper mapper,
                IHttpContextAccessor httpContextAccessor,
                IPunchService punchService,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _punchService = punchService;
            _unitOfWork = unitOfWork;

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        public Task<SwaggerResponse<ObservableCollection<PunchDto>>> GetPunchesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<DayResponse>> GetDayAsync(double? day, double? month, double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var response = _unitOfWork.DayPunches.GetDay(userId, day, month, year);
                return Task.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new DayResponse { Status = new OpResult { Success = false, Result = $"Failed to get day {day} punches" } };
                return HandleException<DayResponse>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<WeekResponse>> GetWeekAsync(double? week, double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var response = _unitOfWork.WeekPunches.GetWeek(userId, week, year);
                return Task.FromResult(new SwaggerResponse<WeekResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new WeekResponse { Status = new OpResult { Success = false, Result = $"Failed to get week {week} punches" } };
                return HandleException<WeekResponse>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<MonthResponse>> GetMonthAsync(double? month, double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var response = _punchService.GetMonth(userId, month, year);
                return Task.FromResult(new SwaggerResponse<MonthResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new MonthResponse { Status = new OpResult { Success = false, Result = $"Failed to get month {month} punches" } };
                return HandleException<MonthResponse>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<YearResponse>> GetYearAsync(double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var response = _unitOfWork.YearPunches.GetYear(userId, year);
                return Task.FromResult(new SwaggerResponse<YearResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new YearResponse { Status = new OpResult { Success = false, Result = $"Failed to get year {year} punches" } };
                return HandleException<YearResponse>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<DayResponse>> PunchInAsync()
        {
            return PunchAsync(true);
        }

        public Task<SwaggerResponse<DayResponse>> PunchOutAsync()
        {
            return PunchAsync(false);
        }

        public Task<SwaggerResponse> PunchDeleteAsync(DeletePunchDto deletePunchDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var punchIdentity = _mapper.Map<Punch>(deletePunchDto);

                _punchService.DeletePunch(punchIdentity, userId);
                return Task.FromResult(new SwaggerResponse(StatusCodes.Status200OK, headers));
            }
            catch (Exception exception)
            {
                var response = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" };
                return HandleException(exception, headers);
            }
        }

        public Task<SwaggerResponse> PunchModifyAsync(ModifyPunchDto modifyPunchDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var punchIdentity = _mapper.Map<Punch>(modifyPunchDto);

                _punchService.UpdatePunch(punchIdentity, userId);
                return Task.FromResult(new SwaggerResponse(StatusCodes.Status200OK, headers));
            }
            catch (Exception exception)
            {
                var response = new PunchResponse { Status = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" } };
                return HandleException(exception, headers);
            }
        }


        #region Other

        private Task<SwaggerResponse<DayResponse>> PunchAsync(bool direction)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                foreach (var cl in _httpContextAccessor.HttpContext.User.Claims)
                {
                    System.Console.WriteLine(cl.Subject.Name);
                }
                _unitOfWork.Punches.Punch(userId, direction);
                var response = _unitOfWork.DayPunches.GetDay(userId, null, null, null);
                return Task.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new DayResponse { Status = new OpResult { Success = false, Result = $"Failed to punch and get Today's punches. Exception: {exception.Message}" } };
                return HandleException<DayResponse>(exception, headers);
            }
        }
        #endregion
    }
}