using TpDotNetCore.Helpers;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TpDotNetCore.Controllers
{
#pragma warning disable // Disable all warnings

    public interface ITpOtherController
    {
        /// <summary>Send email message to system administrator</summary>
        /// <param name="mailMessage">The mail content</param>
        /// <returns>Mail sent</returns>
        Task<SwaggerResponse> SendMailAsync(MailDto mailMessage);

        /// <summary>Send slack message to system administrator</summary>
        /// <param name="slackMessage">The message content</param>
        /// <returns>Slack sent</returns>
        Task<SwaggerResponse> SendSlackAsync(MailDto slackMessage);
    }

    [Route("api/v1/other")]
    [Authorize]
    public partial class TpOtherController : TpBaseController
    {
        private ITpOtherController _implementation;

        public TpOtherController(ITpOtherController implementation)
        {
            _implementation = implementation;
        }

        /// <summary>Send email message to system administrator</summary>
        /// <param name="mailMessage">The mail content</param>
        /// <returns>Mail sent</returns>
        [HttpPost, Route("sendMail")]
        [SwaggerResponse("200", typeof(void))]
        public async Task<IActionResult> SendMail([FromBody] MailDto mailMessage)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.SendMailAsync(mailMessage).ConfigureAwait(false);
            return ProcessResponse(result);
        }

        /// <summary>Send slack message to system administrator</summary>
        /// <param name="slackMessage">The message content</param>
        /// <returns>Slack sent</returns>
        [HttpPost, Route("sendSlack")]
        [SwaggerResponse("200", typeof(void))]
        public async Task<IActionResult> SendSlack([FromBody] MailDto slackMessage)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.SendSlackAsync(slackMessage).ConfigureAwait(false);
            return ProcessResponse(result);
        }
    }
}