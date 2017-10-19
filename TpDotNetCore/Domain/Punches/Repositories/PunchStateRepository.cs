using System;
using System.Collections.Generic;
using System.Linq;
using TpDotNetCore.Controllers;
using TpDotNetCore.Data;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public class PunchStateRepository : IPunchStateRepository
    {
        private readonly TpContext context;
        public PunchStateRepository(TpContext context)
        {
            this.context = context;
        }

        public void Delete(PunchState entity)
        {
            throw new System.NotImplementedException();
        }

        public IList<PunchState> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public void Insert(PunchState entity)
        {
            entity.Id = Guid.NewGuid().ToString();
            context.PunchStates.Add(entity);
            context.SaveChanges();
        }

        public void Update(PunchState entity)
        {
            throw new System.NotImplementedException();
        }

        public PunchState GetByValue(StatusAdminDtoStatus status)
        {
            return context.PunchStates.FirstOrDefault(p => p.State == status.ToString());
        }
    }
}