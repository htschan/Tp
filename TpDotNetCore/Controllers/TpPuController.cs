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

    public interface ITpPuController
    {
        /// <summary>Get the list of users [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Returns users</returns>
        Task<SwaggerResponse<UsersDto>> PuGetUsersAsync();

        /// <summary>Retrieves all punches of current user of selected month</summary>
        /// <param name="userId">The user id</param>
        /// <param name="month">The month number selector [1 .. 12]</param>
        /// <param name="year">The year number selector [2015 .. 2099]</param>
        /// <returns>A month punches object</returns>
        Task<SwaggerResponse<MonthResponse>> PuGetMonthAsync(string userId, double? month, double? year);

        /// <summary>Modifiziert einen Zeitstempel [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Punch modified</returns>
        Task<SwaggerResponse> PuModifyPunchAsync(ModifyPunchAdminDto modifyPunchAdminDto);

        /// <summary>Setzt den Status der Monatsabrechung [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Month status set</returns>
        Task<SwaggerResponse> PuSetMonthStatusAsync(StatusAdminDto setStatusAdminDto);

    }

    [Route("api/v1/pu")]
    [Authorize]
    public partial class TpPuController : TpBaseController
    {
        private ITpPuController _implementation;

        public TpPuController(ITpPuController implementation)
        {
            _implementation = implementation;
        }

        /// <summary>Get the list of users [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Returns users</returns>
        [Authorize(Policy = "RequireApiPowerRole")]
        [HttpGet, Route("getUsers")]
        [SwaggerResponse("200", typeof(UsersDto))]
        public async Task<IActionResult> PuGetUsers()
        {
            var result = await _implementation.PuGetUsersAsync().ConfigureAwait(false);
            return ProcessResponse<UsersDto>(result);
        }

        /// <summary>Retrieves all punches of current user of selected month</summary>
        /// <param name="userId">The user id</param>
        /// <param name="month">The month number selector [1 .. 12]</param>
        /// <param name="year">The year number selector [2015 .. 2099]</param>
        /// <returns>A month punches object</returns>
        [HttpGet, Route("getMonthPunches")]
        [SwaggerResponse("200", typeof(MonthResponse))]
        public async Task<IActionResult> PuGetMonth(string userId, double? month, double? year)
        {
            var result = await _implementation.PuGetMonthAsync(userId, month, year).ConfigureAwait(false);
            return ProcessResponse<MonthResponse>(result);
        }

        /// <summary>Modifiziert einen Zeitstempel [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Punch modified</returns>
        [Authorize(Policy = "RequireApiPowerRole")]
        [HttpPost, Route("punchModify")]
        [SwaggerResponse("200", typeof(void))]
        public async Task<IActionResult> PuModifyPunch([FromBody] ModifyPunchAdminDto modifyPunchAdminDto)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.PuModifyPunchAsync(modifyPunchAdminDto).ConfigureAwait(false);
            return ProcessResponse(result);
        }

        /// <summary>Setzt den Status der Monatsabrechung [Authorize(Policy = "RequireApiPowerRole")]</summary>
        /// <returns>Month status set</returns>
        [Authorize(Policy = "RequireApiPowerRole")]
        [HttpPost, Route("setMonthStatus")]
        [SwaggerResponse("200", typeof(void))]
        public async Task<IActionResult> PuSetMonthStatus([FromBody] StatusAdminDto setStatusAdminDto)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.PuSetMonthStatusAsync(setStatusAdminDto).ConfigureAwait(false);
            return ProcessResponse(result);
        }
    }
}