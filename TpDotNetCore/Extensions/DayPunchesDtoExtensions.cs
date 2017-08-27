using System.Collections.Generic;
using System.Linq;
using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.Punches;

namespace TpDotNetCore.Extensions
{
    public static class DayPunchesDtoExtensions
    {
        public static DayPunchesDto GetRowedDayPunches(this DayPunchesDto dayPunchesDto, Punch[] punchArray)
        {
            if (dayPunchesDto == null)
            {
                throw new System.ArgumentNullException(nameof(dayPunchesDto));
            }

            double dayTotal = 0.0;
            dayPunchesDto.Punches = new List<PunchRowDto>();
            var dayPunchesArray = punchArray.OrderBy(dp => dp.TimeDec).ToArray();
            var i = 0;
            do
            {
                var row = new PunchRowDto();
                if (punchArray.Count() > 0)
                {
                    var punch = dayPunchesArray[i];
                    if (punch.Direction)
                    {
                        row.Enter = new PunchDto();
                        row.Enter.SetPunch(punch);
                        if (i < dayPunchesArray.Length - 1 && !dayPunchesArray[i + 1].Direction)
                        {
                            i++;
                            punch = dayPunchesArray[i];
                            row.Leave = new PunchDto();
                            row.Leave.SetPunch(punch);
                        }
                    }
                    else
                    {
                        row.Leave = new PunchDto();
                        row.Leave.SetPunch(punch);
                    }
                }
                // calc dayTotal
                dayTotal += row.GetRowTotal();
                dayPunchesDto.Punches.Add(row);
                i++;
            } while (i < punchArray.Count());
            dayPunchesDto.Daytotal = dayTotal;
            return dayPunchesDto;
        }
    }
}