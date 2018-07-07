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

namespace TpDotNetCore.Controllers
{
    public class TpOtherControllerImpl : TpBaseControllerImpl, ITpOtherController
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MailConfigOptions _mailConfigOptions;
        private readonly SlackConfigOptions _slackConfigOptions;
        private readonly ISendMail _mailClient;
        private readonly ISlackClient _slackClient;
        private readonly IUnitOfWork _unitOfWork;

        public TpOtherControllerImpl(IMapper mapper,
                IHttpContextAccessor httpContextAccessor,
                IOptions<MailConfigOptions> optionsAccessorMail,
                IOptions<SlackConfigOptions> optionsAccessorSlack,
                ISendMail mailClient,
                ISlackClient slackClient,
                IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _mailConfigOptions = optionsAccessorMail.Value;
            _slackConfigOptions = optionsAccessorSlack.Value;
            _mailClient = mailClient;
            _slackClient = slackClient;
            _unitOfWork = unitOfWork;

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        public Task<SwaggerResponse> SendMailAsync(MailDto mailMessage)
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
                return Task.Run(() => new SwaggerResponse(StatusCodes.Status200OK, headers));
            }
            catch (Exception exception)
            {
                return HandleException(exception, headers);
            }
        }

        public Task<SwaggerResponse> SendSlackAsync(MailDto slackMessage)
        {
            var headers = new Dictionary<string, IEnumerable<string>>();
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst(cl => cl.Type.Equals("id")).Value;
                var profile = _unitOfWork.AppProfiles.FindById(userId);
                _slackClient.SetConfig(_slackConfigOptions);
                _slackClient.PostMessage($"From {profile.Identity.Email}: {slackMessage.Subject} {slackMessage.Body}");
                return Task.Run(() => new SwaggerResponse(StatusCodes.Status200OK, headers));
            }
            catch (Exception exception)
            {
                return HandleException(exception, headers);
            }
        }

        public Task<SwaggerResponse<ProfileResponseDto>> GetProfileAsync(string userid)
        {
            throw new NotImplementedException();
        }
    }
}