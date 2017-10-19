using TpDotNetCore.Controllers;

namespace TpDotNetCore.Domain.Punches
{
    public interface IPunchService
    {
        void UpdatePunch(Punch punchEntity, string userId);
        void DeletePunch(Punch punchEntity, string userId);
        MonthState SetMonthState(string userId, double? month, double? year, StatusAdminDtoStatus state);
        StatusAdminDto GetMonthState(string userId, double? month, double? year);
        MonthResponse GetMonth(string userId, double? month, double? year);
    }
}