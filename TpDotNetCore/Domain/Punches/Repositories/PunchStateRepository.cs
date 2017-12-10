using System;
using System.Collections.Generic;
using System.Linq;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class PunchStateRepository : Repository<PunchState, string>, IPunchStateRepository
    {
        public PunchStateRepository(TpContext context) : base(context)
        {
        }

        public PunchState GetByValue(StatusAdminDtoStatus status)
        {
            return Context.PunchStates.FirstOrDefault(p => p.State == status.ToString());
        }
    }
}