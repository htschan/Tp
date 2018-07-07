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
using Microsoft.Extensions.Options;

namespace TpDotNetCore.Controllers
{
    public class TpUserControllerImpl : TpBaseControllerImpl, ITpUserController
    {
        private readonly IMapper _mapper;
        private readonly AppUser _appUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MailConfigOptions _mailConfigOptions;
        private readonly ISendMail _mailClient;
        private readonly IUnitOfWork _unitOfWork;

        public TpUserControllerImpl(IMapper mapper,
                AppUser appUser,
                UserManager<AppUser> userManager,
                AppUserManager appUserManager,
                IHttpContextAccessor httpContextAccessor,
                IOptions<MailConfigOptions> optionsAccessorMail,
                ISendMail mailClient,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _appUser = appUser;
            _userManager = userManager;
            _appUserManager = appUserManager;
            _httpContextAccessor = httpContextAccessor;
            _mailConfigOptions = optionsAccessorMail.Value;
            _mailClient = mailClient;
            _unitOfWork = unitOfWork;

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        public Task<SwaggerResponse<AuthResponse>> AuthenticateAsync(CredentialDto credentials)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var authResponse = _appUser.Authenticate(credentials);
                return Task.FromResult(
                    new SwaggerResponse<AuthResponse>(
                        StatusCodes.Status200OK,
                        headers,
                        new AuthResponse { Token = authResponse.authToken, ValidFor = authResponse.expiresIn, Id = authResponse.id, Refreshtoken = authResponse.refreshToken, Status = new OpResult { Success = true, Result = "Authentication successful" } }));
            }
            catch (RepositoryException exception)
            {
                return Task.FromResult(
                    new SwaggerResponse<AuthResponse>(
                        exception.StatusCode,
                        headers,
                        new AuthResponse { Token = "", Status = new OpResult { Success = false, Result = "Authentication failed" } }, exception.Message));
            }
        }

        public Task<SwaggerResponse<AuthResponse>> RefreshtokenAsync(RefreshTokenDto refreshtokenparameter)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var authResponse = _appUser.RefreshToken(refreshtokenparameter);
                return Task.FromResult(
                    new SwaggerResponse<AuthResponse>(
                        StatusCodes.Status200OK,
                        headers,
                        new AuthResponse { Token = authResponse.authToken, ValidFor = authResponse.expiresIn, Id = authResponse.id, Refreshtoken = authResponse.refreshToken, Status = new OpResult { Success = true, Result = "RefreshToken successful" } }));
            }
            catch (RepositoryException exception)
            {
                return Task.FromResult(
                    new SwaggerResponse<AuthResponse>(
                        exception.StatusCode,
                        headers,
                        new AuthResponse { Token = "failed to refresh", Status = new OpResult { Success = false, Result = "RefreshToken failed" } }, exception.Message));
            }
        }

        public Task<SwaggerResponse<RegisterResponse>> RegisterUserAsync(RegisterDto registerDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userIdentity = _mapper.Map<AppUser>(registerDto);
            var result = _userManager.CreateAsync(userIdentity, registerDto.Password).Result;

            if (!result.Succeeded)
                return Task.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            var confirmationToken = _userManager.GenerateEmailConfirmationTokenAsync(userIdentity).Result;
            var cnf = System.Text.Encodings.Web.UrlEncoder.Default.Encode(confirmationToken);
            var to = new EmailAddress { Name = "Hans Tschan", Email = "hans.tschan@gmail.com" };
            var mailPayload = new MailPayload { Subject = "Bestätigung Kontoeröffnung" };
            mailPayload.From = new EmailAddress { Email = _mailConfigOptions.From };
            mailPayload.Body = $"Das ist ihr Link zum Bestätigen - bitte klicken Sie <a href='http://localhost:5000/api/v1/confirm?cnf={cnf}&id={userIdentity.Id}'>hier</a>, um Ihre E-Mail Adresse zu bestätigen.";
            _mailClient.SetOptions(_mailConfigOptions);
            _mailClient.SendEmail(mailPayload);
            return Task.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
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

        public Task<SwaggerResponse<ConfirmResponse>> ConfirmRegisterAsync(string userid, string confirmToken)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();

            var user = _userManager.FindByIdAsync(userid).Result;
            IdentityResult result = _userManager.ConfirmEmailAsync(user, confirmToken).Result;
            if (!result.Succeeded)
                return Task.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            return Task.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
        }

        public Task<SwaggerResponse<RecoverPasswordResponse>> RecoverPasswordAsync(RecoverPasswordParams recoverPasswordParams)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<RecoverUsernameResponse>> RecoverUsernameAsync(RecoverUsernameParams recoverUsernameParams)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<SetPasswordResponse>> SetPasswordAsync(SetPasswordParams setPasswordParams)
        {
            throw new NotImplementedException();
        }
    }
}