using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TpDotNetCore.Entities;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Data
{
    public class DbInitializer : IDisposable
    {
        private TpContext _context;
        private UserManager<User> _userManager;
        private IMapper _mapper;
        private IHolidayService _holidayService;
        private ITimeService _timeService;
        private Random _random;

        public DbInitializer(TpContext context, UserManager<User> userManager, IMapper mapper, IHolidayService holidayService, ITimeService timeService)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _holidayService = holidayService;
            _timeService = timeService;
            _random = new Random((int)DateTime.Now.Ticks);
        }

        public async void Initialize()
        {
            _context.Database.EnsureCreated();

            // Look for any users.
            if (_context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var userDict = new Dictionary<int, User>();
            var dayDict = new Dictionary<int, DayPunch>();
            var weekDict = new Dictionary<int, WeekPunch>();
            var monthDict = new Dictionary<int, MonthPunch>();
            var yearDict = new Dictionary<int, YearPunch>();

            // create some users
            var users = new TpDotNetCore.Controllers.RegisterVm[]
            {
                new TpDotNetCore.Controllers.RegisterVm { Firstname = "Hans", Name = "Tschan", Email = "hts@koch-it.ch", Username = "hts" },
                new TpDotNetCore.Controllers.RegisterVm { Firstname = "Hanspeter", Name = "Gysin", Email = "hgy@koch-it.ch", Username = "hgy" },
                new TpDotNetCore.Controllers.RegisterVm { Firstname = "Matthias", Name = "Höhner", Email = "mho@koch-it.ch", Username = "mho" },
                new TpDotNetCore.Controllers.RegisterVm { Firstname = "Alexander", Name = "Hilty", Email = "ahi@koch-it.ch", Username = "ahi" },
                new TpDotNetCore.Controllers.RegisterVm { Firstname = "Angelo", Name = "Spatharis", Email = "asp@koch-it.ch", Username = "asp" },
            };
            for (var i = 0; i < users.Length; i++)
            {
                var userIdentity = _mapper.Map<User>(users[i]);
                userIdentity.EmailConfirmed = true;
                var user = await _userManager.CreateAsync(userIdentity, "axil311");
                userDict.Add(i, userIdentity);
            }
            _context.SaveChanges();

            // create the punch dimensions
            for (var i = 1; i < 32; i++)
            {
                var d = new DayPunch { Day = i };
                dayDict.Add(i, d);
                _context.DayPunches.Add(d);
            }
            for (var i = 1; i < 54; i++)
            {
                var w = new WeekPunch { Week = i };
                weekDict.Add(i, w);
                _context.WeekPunches.Add(w);
            }
            for (var i = 1; i < 13; i++)
            {
                var m = new MonthPunch { Month = i };
                monthDict.Add(i, m);
                _context.MonthPunches.Add(m);
            }
            for (var i = 2015; i < 2035; i++)
            {
                var y = new YearPunch { Year = i };
                yearDict.Add(i, y);
                _context.YearPunches.Add(y);
            }

            // create some punches for every user
            for (DateTime date = new DateTime(2015, 1, 1); date <= new DateTime(2017, 6, 16); date += TimeSpan.FromDays(1))
            {
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                var dateTimePrev = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);
                for (var p = 1; p < 6; p++) // day punches
                {
                    if (p > 4) // todo: excess punches
                        continue;

                    foreach (var u in userDict)
                    {
                        var timeInfo = GetPunchTime(dateTimePrev, date.Year, date.Month, date.Day, p);
                        var punch = new Punch
                        {
                            Created = DateTime.Now,
                            Updated = DateTime.MinValue,
                            PunchTime = timeInfo.dt,
                            TimeDec = timeInfo.dtDec,
                            Direction = timeInfo.direction,
                            DayPunch = dayDict[timeInfo.dt.Day],
                            WeekPunch = weekDict[_timeService.GetWeekNumber(timeInfo.dt)],
                            MonthPunch = monthDict[timeInfo.dt.Month],
                            YearPunch = yearDict[timeInfo.dt.Year],
                            User = u.Value
                        };
                        dateTimePrev = timeInfo.dt;
                        _context.Punches.Add(punch);
                    }
                }
            }

            _context.SaveChanges();
        }

        private (DateTime dt, decimal dtDec, bool direction) GetPunchTime(DateTime dateTimePrevious, int year, int month, int day, int s)
        {
            var t = new[] { 0, 7, 11, 12, 16, 18, 20 };
            var totalSeconds = _random.Next(7200); // 0 .. 2 hours
            var hours = t[s] + totalSeconds / 3600;
            var minutes = totalSeconds % 3600 / 60;
            var seconds = totalSeconds % 60;
            var time = new DateTime(year, month, day, hours, minutes, seconds);
            if (time < dateTimePrevious)
                time = dateTimePrevious + TimeSpan.FromMinutes(10 + _random.Next(10));
            var tdec = _timeService.GetDecimalHour(time);
            return (dt: time, dtDec: Math.Round(tdec, 2), direction: s % 2 == 1);
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~DbInitializer() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        void IDisposable.Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion

    }

}