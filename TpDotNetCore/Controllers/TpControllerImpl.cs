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
using TpDotNetCore.Domain;
using Common.Communication;

namespace TpDotNetCore.Controllers
{
    public class TpControllerImpl : ITpController
    {
        private readonly IMapper _mapper;
        private readonly AppUser _appUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppUserManager _appUserManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MailConfigOptions _mailConfigOptions;
        private readonly SlackConfigOptions _slackConfigOptions;
        private readonly IPunchService _punchService;
        private readonly ISendMail _mailClient;
        private readonly ISlackClient _slackClient;
        private readonly IUnitOfWork _unitOfWork;

        public TpControllerImpl(IMapper mapper,
                AppUser appUser,
                UserManager<AppUser> userManager,
                AppUserManager appUserManager,
                IHttpContextAccessor httpContextAccessor,
                IOptions<MailConfigOptions> optionsAccessorMail,
                IOptions<SlackConfigOptions> optionsAccessorSlack,
                IPunchService punchService,
                ISendMail mailClient,
                ISlackClient slackClient,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _appUser = appUser;
            _userManager = userManager;
            _appUserManager = appUserManager;
            _httpContextAccessor = httpContextAccessor;
            _mailConfigOptions = optionsAccessorMail.Value;
            _slackConfigOptions = optionsAccessorSlack.Value;
            _punchService = punchService;
            _mailClient = mailClient;
            _slackClient = slackClient;
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

        public Task<SwaggerResponse<OpResult>> SendMailAsync(MailDto mailMessage)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var profile = _unitOfWork.AppProfiles.FindById(userId);
                var to = new EmailAddress { Email = "hans.tschan@gmail.com" };
                var from = new EmailAddress { Email = profile.Identity.Email };
                var mailPayload = new MailPayload { Subject = mailMessage.Subject, Body = mailMessage.Body, From = from };
                mailPayload.ToList.Add(from);
                _mailClient.SetOptions(_mailConfigOptions);
                _mailClient.SendEmail(mailPayload);
                return Task.Run(() => new SwaggerResponse<OpResult>(StatusCodes.Status200OK, headers, new OpResult { Result = "2", Success = true }));
            }
            catch (Exception exception)
            {
                return HandleException<OpResult>(exception, headers);
            }
        }

        public Task<SwaggerResponse<OpResult>> SendSlackAsync(MailDto slackMessage)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var profile = _unitOfWork.AppProfiles.FindById(userId);
                _slackClient.SetConfig(_slackConfigOptions);
                _slackClient.PostMessage($"From {profile.Identity.Email}: {slackMessage.Subject} {slackMessage.Body}");
                return Task.Run(() => new SwaggerResponse<OpResult>(StatusCodes.Status200OK, headers, new OpResult { Result = "2", Success = true }));
            }
            catch (Exception exception)
            {
                return HandleException<OpResult>(exception, headers);
            }
        }

        public Task<SwaggerResponse<ProfileResponseDto>> GetProfileAsync(string userid)
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
                _unitOfWork.Punches.Punch(userId, direction);
                var response = _unitOfWork.DayPunches.GetDay(userId, null, null, null);
                return Task.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, response));
            }
            catch (Exception exception)
            {
                var response = new DayResponse { Status = new OpResult { Success = false, Result = $"Failed to punch and get Today's punches. Exception: {exception.Message}" } };
                return HandleException<DayResponse>(exception, headers, response);
            }
        }
        #endregion

        private Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers, T response)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, response, exception.Message));
            return Task.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, response, exception.Message));
        }
        private Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, default(T), exception.Message));
            return Task.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, default(T), exception.Message));
        }
    }
}