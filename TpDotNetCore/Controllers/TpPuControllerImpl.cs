using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.Punches;
using TpDotNetCore.Domain;

namespace TpDotNetCore.Controllers
{
    public class TpPuControllerImpl : TpBaseControllerImpl, ITpPuController
    {
        private readonly IMapper _mapper;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPunchService _punchService;
        private readonly IUnitOfWork _unitOfWork;

        public TpPuControllerImpl(IMapper mapper,
                AppUserManager appUserManager,
                IHttpContextAccessor httpContextAccessor,
                IPunchService punchService,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _appUserManager = appUserManager;
            _httpContextAccessor = httpContextAccessor;
            _punchService = punchService;
            _unitOfWork = unitOfWork;

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        public Task<SwaggerResponse> PuModifyPunchAsync(ModifyPunchAdminDto modifyPunchAdminDto)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse> PuSetMonthStatusAsync(StatusAdminDto setStatusAdminDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                _punchService.SetMonthState(setStatusAdminDto.Userid, setStatusAdminDto.Month, setStatusAdminDto.Year, setStatusAdminDto.Status.Value);
                return Task.FromResult(new SwaggerResponse(StatusCodes.Status200OK, headers));
            }
            catch (Exception exception)
            {
                var response = new PunchResponse { Status = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" } };
                return HandleException(exception, headers);
            }
        }

        #region Other

        public Task<SwaggerResponse<UsersDto>> PuGetUsersAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var entities = _appUserManager.PuGetUsers();
                var userDtoList = _mapper.Map<IList<AppUser>, List<UserDto>>(entities);
                var dto = new UsersDto { Users = userDtoList };
                return Task.Run(() => new SwaggerResponse<UsersDto>(StatusCodes.Status200OK, headers, dto));
            }
            catch (Exception exception)
            {
                return HandleException<UsersDto>(exception, headers, new UsersDto());
            }
        }

        public Task<SwaggerResponse<MonthResponse>> PuGetMonthAsync(string userId, double? month, double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var response = _punchService.GetMonth(userId, month, year);
                return Task.FromResult(new SwaggerResponse<MonthResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new MonthResponse { Status = new OpResult { Success = false, Result = $"Failed to get month {month} punches" } };
                return HandleException<MonthResponse>(exception, headers, response);
            }
        }
        #endregion
    }
}