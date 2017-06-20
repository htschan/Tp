using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TpDotNetCore.Auth;
using TpDotNetCore.Entities;
using TpDotNetCore.Models;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Data;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Globalization;
using System.Linq.Expressions;

namespace TpDotNetCore.Controllers
{
    public class TpControllerImpl : ITpController
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly TpContext _appDbContext;
        private readonly TpMailConfigOptions _tpConfigOptions;
        private readonly ITimeService _timeService;

        public TpControllerImpl(UserManager<User> userManager, IJwtFactory jwtFactory, IOptions<JwtIssuerOptions> jwtOptions, IHttpContextAccessor httpContextAccessor, IMapper mapper, TpContext appDbContext, IOptions<TpMailConfigOptions> optionsAccessor, ITimeService timeService)
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _appDbContext = appDbContext;
            _tpConfigOptions = optionsAccessor.Value;
            _timeService = timeService;

            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        Task<SwaggerResponse<AuthResponse>> ITpController.AuthenticateAsync(CredentialVm credentials)
        {
            var identity = GetClaimsIdentity(credentials.Email, credentials.Password).Result;
            var headers = new Dictionary<string, IEnumerable<string>>();
            if (identity.claimsIdentiy == null)
            {
                return Task<SwaggerResponse<AuthResponse>>.FromResult(new SwaggerResponse<AuthResponse>(StatusCodes.Status404NotFound, headers, new AuthResponse { Token = "failed to auth" }, identity.message));
            }

            // Serialize and return the response
            var response = new
            {
                id = identity.claimsIdentiy.Claims.Single(c => c.Type == "id").Value,
                auth_token = _jwtFactory.GenerateEncodedToken(credentials.Email, identity.claimsIdentiy),
                expires_in = (int)_jwtOptions.ValidFor.TotalSeconds
            };

            return Task<SwaggerResponse<AuthResponse>>.FromResult(new SwaggerResponse<AuthResponse>(StatusCodes.Status200OK, headers, new AuthResponse { Token = response.auth_token.Result }));
        }

        Task<SwaggerResponse<RegisterResponse>> ITpController.RegisterUserAsync(RegisterVm registerVm)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userIdentity = _mapper.Map<User>(registerVm);
            var result = _userManager.CreateAsync(userIdentity, registerVm.Password).Result;

            if (!result.Succeeded)
                return Task<SwaggerResponse<RegisterResponse>>.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            var confirmationToken = _userManager.GenerateEmailConfirmationTokenAsync(userIdentity).Result;
            SendEmail(userIdentity.Id, confirmationToken);

            return Task<SwaggerResponse<RegisterResponse>>.FromResult(new SwaggerResponse<RegisterResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
        }

        Task<SwaggerResponse<ConfirmResponse>> ITpController.ConfirmRegisterAsync(string userid, string confirmToken)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();

            var user = _userManager.FindByIdAsync(userid).Result;
            IdentityResult result = _userManager.ConfirmEmailAsync(user, confirmToken).Result;
            if (!result.Succeeded)
                return Task<SwaggerResponse<ConfirmResponse>>.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status400BadRequest, headers, null, result.ToString()));

            return Task<SwaggerResponse<ConfirmResponse>>.FromResult(new SwaggerResponse<ConfirmResponse>(StatusCodes.Status201Created, headers, null, result.ToString()));
        }

        Task<SwaggerResponse<RecoverPasswordResponse>> ITpController.RecoverPasswordAsync(RecoverPasswordParams recoverPasswordParams)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<RecoverUsernameResponse>> ITpController.RecoverUsernameAsync(RecoverUsernameParams recoverUsernameParams)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<SetPasswordResponse>> ITpController.SetPasswordAsync(SetPasswordParams setPasswordParams)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<GetProfilesResponse>> ITpController.GetProfilesAsync()
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<GetProfileResponse>> ITpController.GetMyProfileAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = _userManager.FindByEmailAsync(userId).Result;
            if (profile == null)
            {
                profile = new User();
                profile.UserName = _httpContextAccessor.HttpContext.User.Identity.Name;
            }
            var json = JsonConvert.SerializeObject(profile);
            return Task<SwaggerResponse<GetProfileResponse>>.FromResult(new SwaggerResponse<GetProfileResponse>(StatusCodes.Status200OK, headers, new GetProfileResponse { Status = new OpResult { Success = true } }));
        }

        Task<SwaggerResponse<GetProfileResponse>> ITpController.GetProfileAsync(string userid)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<List<Punch>>> ITpController.GetPunchesAsync()
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<DayResponse>> ITpController.GetTodayAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _userManager.FindByNameAsync(userId).Result;
            if (user == null)
                return Task<SwaggerResponse<DayResponse>>.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status400BadRequest, headers, null, "User not found"));

            var dt = DateTime.Now;
            var punches = _appDbContext.Punches
                .Where(p => p.User.Id == user.Id)
                .Where(p => p.DayPunch.Day == dt.Day)
                .Where(p => p.MonthPunch.Month == dt.Month)
                .Where(p => p.YearPunch.Year == dt.Year)
                .ToList();
            var dayResponse = new DayResponse();
            dayResponse.Status = new OpResult { Success = true };
            dayResponse.Punches = new DayPunchesVm();
            dayResponse.Punches.Userboid = user.Id;
            dayResponse.Punches.Day = dt.Day;
            dayResponse.Punches.Month = dt.Month;
            dayResponse.Punches.Year = dt.Year;
            dayResponse.Punches.Daytotal = 12.12;
            dayResponse.Punches.Punches = new List<Controllers.Punch>();
            foreach (var punch in punches)
            {
                var p1 = new Controllers.Punch();
                p1.Created = punch.Created;
                p1.Direction = punch.Direction;
                p1.Punchid = punch.Id;
                p1.Time = punch.PunchTime;
                p1.Timedec = (double)punch.TimeDec;
                p1.Updated = punch.Updated;
                dayResponse.Punches.Punches.Add(p1);
            }
            return Task<SwaggerResponse<DayResponse>>.FromResult(new SwaggerResponse<DayResponse>(StatusCodes.Status200OK, headers, dayResponse));
        }

        Task<SwaggerResponse<WeekResponse>> ITpController.GetThisWeekAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _userManager.FindByNameAsync(userId).Result;
            if (user == null)
                return Task<SwaggerResponse<WeekResponse>>.FromResult(new SwaggerResponse<WeekResponse>(StatusCodes.Status400BadRequest, headers, null, "User not found"));

            var dt = DateTime.Now;
            var weekPunches = _appDbContext.Punches
                .Where(p => p.User.Id == user.Id)
                .Where(p => p.WeekPunch.Week == _timeService.GetWeekNumber(dt))
                .Where(p => p.YearPunch.Year == dt.Year)
                .GroupBy(p => p.DayPunch.Day)
                .ToList();

            var weekResponse = new WeekResponse();
            weekResponse.Status = new OpResult { Success = true };
            weekResponse.Punches = new WeekPunchesVm();
            weekResponse.Punches.User = user.Id;
            weekResponse.Punches.Week = _timeService.GetWeekNumber(dt);
            weekResponse.Punches.Year = dt.Year;
            weekResponse.Punches.DayPunches = new List<Controllers.DayPunchesVm>();
            foreach (var dayPunches in weekPunches)
            {
                var dayPunch = new DayPunchesVm();
                weekResponse.Punches.DayPunches.Add(dayPunch);
                dayPunch.Punches = new List<Controllers.Punch>();
                foreach (var punch in dayPunches)
                {
                    var p1 = new Controllers.Punch();
                    p1.Created = punch.Created;
                    p1.Direction = punch.Direction;
                    p1.Punchid = punch.Id;
                    p1.Time = punch.PunchTime;
                    p1.Timedec = (double)punch.TimeDec;
                    p1.Updated = punch.Updated;
                    dayPunch.Punches.Add(p1);
                }
            }
            return Task<SwaggerResponse<WeekResponse>>.FromResult(new SwaggerResponse<WeekResponse>(StatusCodes.Status200OK, headers, weekResponse));
        }

        Task<SwaggerResponse<MonthResponse>> ITpController.GetThisMonthAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _userManager.FindByNameAsync(userId).Result;
            if (user == null)
                return Task<SwaggerResponse<MonthResponse>>.FromResult(new SwaggerResponse<MonthResponse>(StatusCodes.Status400BadRequest, headers, null, "User not found"));

            var dt = DateTime.Now;
            var monthPunches = _appDbContext.Punches
                .Where(p => p.User.Id == user.Id)
                .Where(p => p.MonthPunch.Month == dt.Month)
                .Where(p => p.YearPunch.Year == dt.Year)
                .GroupBy(p => p.DayPunch.Day)
                .ToList();

            var monthResponse = new MonthResponse();
            monthResponse.Status = new OpResult { Success = true };
            monthResponse.Punches = new MonthPunchesVm();
            monthResponse.Punches.User = user.Id;
            monthResponse.Punches.Month = dt.Month;
            monthResponse.Punches.Year = dt.Year;
            monthResponse.Punches.Punches = new List<Controllers.DayPunchesVm>();
            foreach (var dayPunches in monthPunches)
            {
                var dayPunch = new DayPunchesVm();
                monthResponse.Punches.Punches.Add(dayPunch);
                dayPunch.Punches = new List<Controllers.Punch>();
                foreach (var punch in dayPunches.OrderBy(p => p.PunchTime))
                {
                    var p1 = new Controllers.Punch();
                    p1.Created = punch.Created;
                    p1.Direction = punch.Direction;
                    p1.Punchid = punch.Id;
                    p1.Time = punch.PunchTime;
                    p1.Timedec = (double)punch.TimeDec;
                    p1.Updated = punch.Updated;
                    dayPunch.Punches.Add(p1);
                }
            }
            return Task<SwaggerResponse<MonthResponse>>.FromResult(new SwaggerResponse<MonthResponse>(StatusCodes.Status200OK, headers, monthResponse));
        }

        Task<SwaggerResponse<YearResponse>> ITpController.GetThisYearAsync()
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _userManager.FindByNameAsync(userId).Result;
            if (user == null)
                return Task<SwaggerResponse<YearResponse>>.FromResult(new SwaggerResponse<YearResponse>(StatusCodes.Status400BadRequest, headers, null, "User not found"));

            var dt = DateTime.Now;
            var yearPunches = _appDbContext.Punches
                .Where(p => p.User.Id == user.Id)
                .Where(p => p.YearPunch.Year == dt.Year)
                .OrderBy(p => p.MonthPunch.Month)
                .GroupBy(p => p.MonthPunch.Month)
                .Select(p => new
                {
                    Month = p.Key,
                    Groups = p.OrderBy(q => q.DayPunch.Day).GroupBy(q => q.DayPunch.Day)
                });

            var yearResponse = new YearResponse();
            yearResponse.Status = new OpResult { Success = true };
            var yearchPunchVm = new YearPunchesVm();
            yearResponse.Punches = yearchPunchVm;
            yearchPunchVm.User = user.Id;
            yearchPunchVm.Year = dt.Year;
            yearchPunchVm.Punches = new List<Controllers.MonthPunchesVm>();
            foreach (var x in yearPunches)
            {
                var monthPunchVm = new MonthPunchesVm();
                yearchPunchVm.Punches.Add(monthPunchVm);
                monthPunchVm.User = user.Id;
                monthPunchVm.Month = x.Month;
                monthPunchVm.Year = dt.Year;
                monthPunchVm.Punches = new List<Controllers.DayPunchesVm>();

                foreach (IGrouping<int, Entities.Punch> dayPunches in x.Groups)
                {
                    var dayPunch = new DayPunchesVm();
                    monthPunchVm.Punches.Add(dayPunch);
                    dayPunch.Punches = new List<Controllers.Punch>();
                    foreach (Entities.Punch punch in dayPunches.OrderBy(p => p.PunchTime))
                    {
                        System.Console.WriteLine(punch.DayPunch);
                        var p1 = new Controllers.Punch();
                        p1.Created = punch.Created;
                        p1.Direction = punch.Direction;
                        p1.Punchid = punch.Id;
                        p1.Time = punch.PunchTime;
                        p1.Timedec = (double)punch.TimeDec;
                        p1.Updated = punch.Updated;
                        dayPunch.Punches.Add(p1);
                    }
                }
            }
            return Task<SwaggerResponse<YearResponse>>.FromResult(new SwaggerResponse<YearResponse>(StatusCodes.Status200OK, headers, yearResponse));
        }

        Task<SwaggerResponse<PunchResponse>> ITpController.PunchInAsync()
        {
            return Punch(true);
        }

        Task<SwaggerResponse<PunchResponse>> ITpController.PunchOutAsync()
        {
            return Punch(false);
        }

        Task<SwaggerResponse<PunchResponse>> ITpController.PunchModifyAsync(ModifyPunchVm modifyPunchViewModel)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<PunchResponse>> ITpController.PunchModifyAdminAsync(ModifyPunchAdminParams modifyPunchAdminParams)
        {
            throw new NotImplementedException();
        }

        Task<SwaggerResponse<PunchResponse>> ITpController.PunchSetStatusAdminAsync(SetStatusAdminParams setStatusAdminParams)
        {
            throw new NotImplementedException();
        }

        #region Other

        private Task<SwaggerResponse<PunchResponse>> Punch(bool direction)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _userManager.FindByNameAsync(userId).Result;
            if (user == null)
                return Task<SwaggerResponse<PunchResponse>>.FromResult(new SwaggerResponse<PunchResponse>(StatusCodes.Status400BadRequest, headers, null, "User not found"));

            var dt = DateTime.Now;
            var day = _appDbContext.DayPunches.FirstOrDefault(d => d.Day == dt.Day);
            var week = _appDbContext.WeekPunches.FirstOrDefault(d => d.Week == _timeService.GetWeekNumber(dt));
            var month = _appDbContext.MonthPunches.FirstOrDefault(d => d.Month == dt.Month);
            var year = _appDbContext.YearPunches.FirstOrDefault(d => d.Year == dt.Year);
            var punch = new Entities.Punch
            {
                PunchTime = dt,
                TimeDec = _timeService.GetDecimalHour(dt),
                Direction = true,
                DayPunch = day,
                WeekPunch = week,
                MonthPunch = month,
                YearPunch = year,
                User = user,
                Created = DateTime.Now,
                Updated = DateTime.MinValue
            };
            _appDbContext.Punches.Add(punch);
            _appDbContext.SaveChanges();
            return Task<SwaggerResponse<PunchResponse>>.FromResult(new SwaggerResponse<PunchResponse>(StatusCodes.Status200OK, headers, new PunchResponse { Status = new OpResult { Success = true } }));
        }

        private async Task<(ClaimsIdentity claimsIdentiy, string message)> GetClaimsIdentity(string userName, string password)
        {
            if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(password))
            {
                // get the user to verifty
                var userToVerify = await _userManager.FindByNameAsync(userName);

                if (userToVerify != null)
                {
                    if (!_userManager.IsEmailConfirmedAsync(userToVerify).Result)
                    {
                        return await Task.FromResult((identity: (ClaimsIdentity)null, message: "Email not yet confirmed"));
                    }
                    // check the credentials  
                    if (await _userManager.CheckPasswordAsync(userToVerify, password))
                    {
                        return await Task.FromResult((identity: _jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id), message: ""));
                    }
                }
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult((identity: (ClaimsIdentity)null, message: "Credentials are invalid or account doesn't exist"));
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
    }
}