using System;

namespace TpDotNetCore.Helpers
{
   public interface IHolidayService
   {
      bool IsHoliday();
      bool IsHoliday(DateTime dt);
   }
}
