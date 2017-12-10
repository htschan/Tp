using TpDotNetCore.Controllers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IPunchStateRepository : IRepository<PunchState, string>
    {
        PunchState GetByValue(StatusAdminDtoStatus status);
    }
}