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
using Common.Communication;

namespace TpDotNetCore.Controllers
{
    public class TpProfileControllerImpl : TpBaseControllerImpl, ITpProfileController
    {
        private readonly IMapper _mapper;
        private readonly AppUser _appUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public TpProfileControllerImpl(IMapper mapper,
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

        public Task<SwaggerResponse<ProfileResponseDto>> GetProfilesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<ProfileResponseDto>> GetMyProfileAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var profile = _unitOfWork.AppProfiles.FindById(userId);
                var profileDto = _mapper.Map<AppProfile, ProfileResponseDto>(profile);
                return Task.Run(() => new SwaggerResponse<ProfileResponseDto>(StatusCodes.Status200OK, headers, profileDto));
            }
            catch (Exception exception)
            {
                var response = new ProfileResponseDto { Status = new OpResult { Success = false, Result = $"Failed to get profile" } };
                return HandleException<ProfileResponseDto>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<ProfileResponseDto>> GetProfileAsync(string userid)
        {
            throw new NotImplementedException();
        }
    }
}