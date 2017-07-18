using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TpDotNetCore.Auth;
using TpDotNetCore.Domain.Punches;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Data;
using MimeKit;
using MailKit.Net.Smtp;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Domain.Punches.Repositories;

namespace TpDotNetCore.Controllers
{
    public class TpControllerImpl : ITpController
    {
        private readonly IMapper _mapper;
        private readonly TpContext _appDbContext;
        private readonly AppUser _appUser;
        private readonly IAppUserRepository _appUserRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly TpMailConfigOptions _tpConfigOptions;
        private readonly ITimeService _timeService;
        private readonly IYearPunchRepository _yearPunchRepository;
        private readonly IMonthPunchRepository _monthPunchRepository;
        private readonly IWeekPunchRepository _weekPunchRepository;
        private readonly IDayPunchRepository _dayPunchRepository;
        private readonly IPunchRepository _punchRepository;

        public TpControllerImpl(IMapper mapper,
                TpContext appDbContext,
                AppUser appUser,
                IAppUserRepository appUserRepoistory,
                UserManager<AppUser> userManager,
                IJwtFactory jwtFactory,
                IOptions<JwtIssuerOptions> jwtOptions,
                IHttpContextAccessor httpContextAccessor,
                IOptions<TpMailConfigOptions> optionsAccessor,
                ITimeService timeService,
                IPunchRepository punchRepository,
                IYearPunchRepository yearPunchRepository,
                IMonthPunchRepository monthPunchRepository,
                IWeekPunchRepository weekPunchRepository,
                IDayPunchRepository dayPunchRepository)
        {
            _mapper = mapper;
            _appDbContext = appDbContext;
            _appUser = appUser;
            _appUserRepository = appUserRepoistory;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _tpConfigOptions = optionsAccessor.Value;
            _timeService = timeService;
            _yearPunchRepository = yearPunchRepository;
            _monthPunchRepository = monthPunchRepository;
            _weekPunchRepository = weekPunchRepository;
            _dayPunchRepository = dayPunchRepository;
            _punchRepository = punchRepository;

            _serializerSettings = new JsonSerializerSettings
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
                return Task<SwaggerResponse<AuthResponse>>.FromResult(
                    new SwaggerResponse<AuthResponse>(
                        StatusCodes.Status200OK,
                        headers,
                        new AuthResponse { Token = authResponse.authToken, ValidFor = authResponse.expiresIn, Id = authResponse.id, Status = new OpResult { Success = true, Result = "Authentication successful" } }));
            }
            catch (Exception exception)
            {
                return HandleException<AuthResponse>(exception, headers);
            }
            // catch (RepositoryException exception)
            // {
            //     return Task<SwaggerResponse<AuthResponse>>.FromResult(
            //         new SwaggerResponse<AuthResponse>(
            //             exception.StatusCode,
            //             headers,
            //             new AuthResponse { Token = "failed to auth", Status = new OpResult { Success = false, Result = "Authenication failed" } }, exception.Message));
            // }
        }

        public Task<SwaggerResponse<RegisterResponse>> RegisterUserAsync(RegisterDto registerDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userIdentity = _mapper.Map<AppUser>(registerDto);
            var result = _userManager.CreateAsync(userIdentity, registerDto.Password).Result;

            if (!result.Succeeded)
                return Task<SwaggerResponse<RegisterResponse>>.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            var confirmationToken = _userManager.GenerateEmailConfirmationTokenAsync(userIdentity).Result;
            SendEmail(userIdentity.Id, confirmationToken);

            return Task<SwaggerResponse<RegisterResponse>>.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
        }

        public Task<SwaggerResponse<ConfirmResponse>> ConfirmRegisterAsync(string userid, string confirmToken)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();

            var user = _userManager.FindByIdAsync(userid).Result;
            IdentityResult result = _userManager.ConfirmEmailAsync(user, confirmToken).Result;
            if (!result.Succeeded)
                return Task<SwaggerResponse<ConfirmResponse>>.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            return Task<SwaggerResponse<ConfirmResponse>>.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
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

        public Task<SwaggerResponse<GetProfilesResponse>> GetProfilesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<GetProfileResponse>> GetMyProfileAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = _userManager.FindByEmailAsync(userId).Result;
            if (profile == null)
            {
                profile = new AppUser();
                profile.UserName = _httpContextAccessor.HttpContext.User.Identity.Name;
            }
            var json = JsonConvert.SerializeObject(profile);
            return Task<SwaggerResponse<GetProfileResponse>>.FromResult(new SwaggerResponse<GetProfileResponse>(StatusCodes.Status200OK, headers, new GetProfileResponse { Status = new OpResult { Success = true } }));
        }

        public Task<SwaggerResponse<GetProfileResponse>> GetProfileAsync(string userid)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<List<PunchDto>>> GetPunchesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<DayResponse>> GetTodayAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var response = _dayPunchRepository.GetCurrent(userId);
                return Task<SwaggerResponse<DayResponse>>.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                return HandleException<DayResponse>(exception, headers);
            }
        }

        public Task<SwaggerResponse<WeekResponse>> GetThisWeekAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var response = _weekPunchRepository.GetCurrent(userId);
                return Task<SwaggerResponse<WeekResponse>>.FromResult(new SwaggerResponse<WeekResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                return HandleException<WeekResponse>(exception, headers);
            }
        }

        public Task<SwaggerResponse<MonthResponse>> GetThisMonthAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var response = _monthPunchRepository.GetCurrent(userId);
                return Task<SwaggerResponse<MonthResponse>>.FromResult(new SwaggerResponse<MonthResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                return HandleException<MonthResponse>(exception, headers);
            }
        }

        public Task<SwaggerResponse<YearResponse>> GetThisYearAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var response = _yearPunchRepository.GetCurrent(userId);
                return Task<SwaggerResponse<YearResponse>>.FromResult(new SwaggerResponse<YearResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                return HandleException<YearResponse>(exception, headers);
            }
        }

        public Task<SwaggerResponse<DayResponse>> PunchInAsync()
        {
            return Punch(true);
        }

        public Task<SwaggerResponse<DayResponse>> PunchOutAsync()
        {
            return Punch(false);
        }

        public Task<SwaggerResponse<PunchResponse>> PunchModifyAsync(ModifyPunchVm modifyPunchViewModel)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<PunchResponse>> PunchModifyAdminAsync(ModifyPunchAdminParams modifyPunchAdminParams)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<PunchResponse>> PunchSetStatusAdminAsync(SetStatusAdminParams setStatusAdminParams)
        {
            throw new NotImplementedException();
        }

        #region Other

        private Task<SwaggerResponse<DayResponse>> Punch(bool direction)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                _punchRepository.Punch(userId, direction);
                var response = _dayPunchRepository.GetCurrent(userId);
                return Task<SwaggerResponse<DayResponse>>.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                return HandleException<DayResponse>(exception, headers);
            }
        }

        private void SendEmail(string userId, string confirmationToken)
        {
            var host = _tpConfigOptions.Host;
            var port = int.Parse(_tpConfigOptions.Port);
            var user = _tpConfigOptions.User;
            var password = _tpConfigOptions.Password;
            var from = _tpConfigOptions.From;
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(from));
            message.To.Add(new MailboxAddress("Hans Tschan", "hans.tschan@gmail.com"));
            message.Subject = "Bestätigung Kontoeröffnung";
            var bodyBuilder = new BodyBuilder();
            var cnf = System.Text.Encodings.Web.UrlEncoder.Default.Encode(confirmationToken);
            bodyBuilder.HtmlBody = $@"<p>Das ist ihr Link zum Bestätigen - bitte klicken Sie <a href='http://localhost:5000/api/v1/confirm?cnf={cnf}&id={userId}'>hier</a>, um Ihre E-Mail Adresse zu bestätigen.</p>";
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.Connect(host, port, false);
                // Note: since we don't have an OAuth2 token, disable 	
                // the XOAUTH2 authentication mechanism.     
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(user, password);
                client.Send(message);
                client.Disconnect(true);
            }
        }
        #endregion
        private Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers)
        {
            if (exception is RepositoryException)
                return Task<SwaggerResponse<T>>.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, default(T), exception.Message));
            return Task<SwaggerResponse<T>>.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, default(T), exception.Message));
        }
    }
}