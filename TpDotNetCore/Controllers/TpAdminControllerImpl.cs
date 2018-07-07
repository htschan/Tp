using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain;

namespace TpDotNetCore.Controllers
{
    public class TpAdminControllerImpl : TpBaseControllerImpl, ITpAdminController
    {
        private readonly IMapper _mapper;
        private readonly AppUser _appUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public TpAdminControllerImpl(IMapper mapper,
                AppUser appUser,
                UserManager<AppUser> userManager,
                AppUserManager appUserManager,
                IHttpContextAccessor httpContextAccessor,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _appUser = appUser;
            _userManager = userManager;
            _appUserManager = appUserManager;
            _httpContextAccessor = httpContextAccessor;
            _unitOfWork = unitOfWork;

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }


        public Task<SwaggerResponse<UsersDto>> AdminGetUsersAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var entities = _appUserManager.GetUsers();
                var userDtoList = _mapper.Map<IList<AppUser>, List<UserDto>>(entities);
                var dto = new UsersDto { Users = userDtoList };
                return Task.Run(() => new SwaggerResponse<UsersDto>(StatusCodes.Status200OK, headers, dto));
            }
            catch (Exception exception)
            {
                return HandleException<UsersDto>(exception, headers, new UsersDto());
            }
        }

        public Task<SwaggerResponse<SessionsDto>> AdminGetSessionsAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var entities = _appUserManager.GetSessions();
                var sessionDtoList = _mapper.Map<IList<RefreshToken>, List<SessionDto>>(entities);
                var dto = new SessionsDto { Sessions = sessionDtoList };
                return Task.Run(() => new SwaggerResponse<SessionsDto>(StatusCodes.Status200OK, headers, dto));
            }
            catch (Exception exception)
            {
                return HandleException<SessionsDto>(exception, headers, new SessionsDto());
            }
        }
    }
}