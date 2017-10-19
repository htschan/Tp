using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TpDotNetCore.Helpers;
using AutoMapper;
using MimeKit;
using MailKit.Net.Smtp;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.Punches.Repositories;
using TpDotNetCore.Domain.Punches;

namespace TpDotNetCore.Controllers
{
    public class TpControllerImpl : ITpController
    {
        private readonly IMapper _mapper;
        private readonly AppUser _appUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly TpMailConfigOptions _tpConfigOptions;
        private readonly IYearPunchRepository _yearPunchRepository;
        private readonly IMonthPunchRepository _monthPunchRepository;
        private readonly IWeekPunchRepository _weekPunchRepository;
        private readonly IDayPunchRepository _dayPunchRepository;
        private readonly IMonthStateRepository _monthStateRepository;
        private readonly IPunchRepository _punchRepository;
        private readonly IPunchService _punchService;

        public TpControllerImpl(IMapper mapper,
                AppUser appUser,
                UserManager<AppUser> userManager,
                AppUserManager appUserManager,
                IHttpContextAccessor httpContextAccessor,
                IOptions<TpMailConfigOptions> optionsAccessor,
                IPunchRepository punchRepository,
                IYearPunchRepository yearPunchRepository,
                IMonthPunchRepository monthPunchRepository,
                IWeekPunchRepository weekPunchRepository,
                IDayPunchRepository dayPunchRepository,
                IMonthStateRepository monthStateRepository,
                IPunchService punchService)
        {
            _mapper = mapper;
            _appUser = appUser;
            _userManager = userManager;
            _appUserManager = appUserManager;
            _httpContextAccessor = httpContextAccessor;
            _tpConfigOptions = optionsAccessor.Value;
            _yearPunchRepository = yearPunchRepository;
            _monthPunchRepository = monthPunchRepository;
            _weekPunchRepository = weekPunchRepository;
            _dayPunchRepository = dayPunchRepository;
            _monthStateRepository = monthStateRepository;
            _punchRepository = punchRepository;
            _punchService = punchService;

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
            SendEmail(userIdentity.Id, confirmationToken);

            return Task.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
        }

        public System.Threading.Tasks.Task<SwaggerResponse<UsersDto>> AdminGetUsersAsync()
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

        public System.Threading.Tasks.Task<SwaggerResponse<SessionsDto>> AdminGetSessionsAsync()
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

        public System.Threading.Tasks.Task<SwaggerResponse<UsersDto>> PuGetUsersAsync()
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

        public System.Threading.Tasks.Task<SwaggerResponse<MonthResponse>> PuGetMonthAsync(string userId, double? month, double? year)
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

        public Task<SwaggerResponse<GetProfilesResponse>> GetProfilesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<GetProfileResponse>> GetMyProfileAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
            var profile = _userManager.FindByEmailAsync(userId).Result;
            if (profile == null)
            {
                profile = new AppUser();
                profile.UserName = _httpContextAccessor.HttpContext.User.Identity.Name;
            }
            var json = JsonConvert.SerializeObject(profile);
            return Task.FromResult(new SwaggerResponse<GetProfileResponse>(StatusCodes.Status200OK, headers, new GetProfileResponse { Status = new OpResult { Success = true } }));
        }

        public Task<SwaggerResponse<GetProfileResponse>> GetProfileAsync(string userid)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<List<PunchDto>>> GetPunchesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<DayResponse>> GetDayAsync(double? day, double? month, double? year)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var response = _dayPunchRepository.GetDay(userId, day, month, year);
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
                var response = _weekPunchRepository.GetWeek(userId, week, year);
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
                var response = _yearPunchRepository.GetYear(userId, year);
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

        public Task<SwaggerResponse<PunchResponse>> PunchModifyAsync(ModifyPunchDto modifyPunchDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var punchIdentity = _mapper.Map<Punch>(modifyPunchDto);

                _punchService.UpdatePunch(punchIdentity, userId);
                return Task.FromResult(new SwaggerResponse<PunchResponse>(StatusCodes.Status200OK, headers, new PunchResponse { Status = new OpResult { Success = true } }));
            }
            catch (Exception exception)
            {
                var response = new PunchResponse { Status = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" } };
                return HandleException<PunchResponse>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<OpResult>> PunchDeleteAsync(DeletePunchDto deletePunchDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var punchIdentity = _mapper.Map<Punch>(deletePunchDto);

                _punchService.DeletePunch(punchIdentity, userId);
                return Task.FromResult(new SwaggerResponse<OpResult>(StatusCodes.Status200OK, headers, new OpResult { Success = true }));
            }
            catch (Exception exception)
            {
                var response = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" };
                return HandleException<OpResult>(exception, headers, response);
            }
        }

        public Task<SwaggerResponse<PunchResponse>> PuModifyPunchAsync(ModifyPunchAdminDto modifyPunchAdminDto)
        {
            throw new NotImplementedException();
        }

        public Task<SwaggerResponse<PunchResponse>> PuSetMonthStatusAsync(StatusAdminDto setStatusAdminDto)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                _punchService.SetMonthState(setStatusAdminDto.Userid, setStatusAdminDto.Month, setStatusAdminDto.Year, setStatusAdminDto.Status.Value);
                return Task.FromResult(new SwaggerResponse<PunchResponse>(StatusCodes.Status200OK, headers, new PunchResponse { Status = new OpResult { Success = true } }));
            }
            catch (Exception exception)
            {
                var response = new PunchResponse { Status = new OpResult { Success = false, Result = $"Failed to delete punch. Exception: {exception.Message}" } };
                return HandleException<PunchResponse>(exception, headers, response);
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
                _punchRepository.Punch(userId, direction);
                var response = _dayPunchRepository.GetDay(userId, null, null, null);
                return Task.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new DayResponse { Status = new OpResult { Success = false, Result = $"Failed to punch and get Today's punches. Exception: {exception.Message}" } };
                return HandleException<DayResponse>(exception, headers, response);
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

        private Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers, T response)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, response, exception.Message));
            return Task.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, response, exception.Message));
        }
    }
}