using TpDotNetCore.Controllers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IPunchRepository : IRepository<Punch>
    {
         void Punch(string userId, bool direction);
    }
}