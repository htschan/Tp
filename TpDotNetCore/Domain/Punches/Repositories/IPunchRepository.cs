using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IPunchRepository : IRepository<Punch, string>
    {
        Punch GetByUser(Punch punch, AppUser user);
        void Punch(string userId, bool direction);
    }
}