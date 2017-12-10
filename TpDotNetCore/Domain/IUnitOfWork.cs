using System;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.Punches.Repositories;
using TpDotNetCore.Domain.UserConfiguration.Repositories;

namespace TpDotNetCore.Domain
{
    public interface IUnitOfWork : IDisposable
    {
        TpContext ApplicationDataContext { get; }
        IAppUserRepository AppUsers { get; }
        IAppProfileRepository AppProfiles { get; }
        IRefreshTokenRepository RefreshTokens { get; }
        IDayPunchRepository DayPunches { get; }
        IWeekPunchRepository WeekPunches { get; }
        IMonthPunchRepository MonthPunches { get; }
        IYearPunchRepository YearPunches { get; }
        IPunchRepository Punches { get; }
        IMonthStateRepository MonthStates { get; }
        IPunchStateRepository PunchStates { get; }
        int Complete();

    }
}