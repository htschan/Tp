using TpDotNetCore.Data;
using TpDotNetCore.Domain.Punches.Repositories;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TpContext _context;

        public UnitOfWork(TpContext context, ITimeService timeService)
        {
            _context = context;
            AppUsers = new AppUserRepository(_context);
            AppProfiles = new AppProfileRepository(_context);
            RefreshTokens = new RefreshTokenRepository(_context);
            DayPunches = new DayPunchRepository(_context, AppUsers);
            WeekPunches = new WeekPunchRepository(_context, timeService, AppUsers);
            MonthPunches = new MonthPunchRepository(_context, timeService, AppUsers);
            YearPunches = new YearPunchRepository(_context, timeService, AppUsers);
            Punches = new PunchRepository(_context, timeService, AppUsers);
            MonthStates = new MonthStateRepository(_context);
            PunchStates = new PunchStateRepository(_context);
        }
        public void Dispose()
        {
            _context.Dispose();
        }

        public TpContext ApplicationDataContext => _context;
        public IAppUserRepository AppUsers { get; }
        public IAppProfileRepository AppProfiles { get; }
        public IRefreshTokenRepository RefreshTokens { get; }

        public IDayPunchRepository DayPunches { get; }
        public IWeekPunchRepository WeekPunches { get; }
        public IMonthPunchRepository MonthPunches { get; }
        public IYearPunchRepository YearPunches { get; }
        public IPunchRepository Punches { get; }
        public IMonthStateRepository MonthStates { get; }
        public IPunchStateRepository PunchStates { get; }

        public int Complete()
        {
            return _context.SaveChanges();
        }
    }
}