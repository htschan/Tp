using TpDotNetCore.Controllers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IPunchStateRepository : IRepository<PunchState>
    {
         PunchState GetByValue(StatusAdminDtoStatus status);
    }
}