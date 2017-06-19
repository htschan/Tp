using System;
using Xunit;

namespace TpDotNetCore.Helpers
{
    public class TestTimeService
    {
        private ITimeService _timeService;

        public TestTimeService()
        {
            _timeService = new TimeService();
        }

        [Fact]
        public void Test_GetDecimalHour()
        {
            var result = _timeService.GetDecimalHour(new DateTime(2017, 6, 6, 12, 45, 00));
            Assert.True(result.Equals(12.75m));
        }

        [Theory]
        [InlineData(2017,1,1,52)]
        [InlineData(2017,1,2,1)]
        [InlineData(2017,1,14,2)]
        [InlineData(2017,6,19,25)]
        [InlineData(2017,12,31,52)]
        public void Test_GetWeekNumber(int year, int month, int day, int weekNumber)
        {
            var result = _timeService.GetWeekNumber(new DateTime(year, month, day));
            Assert.True(result.Equals(weekNumber));
        }
    }
}
