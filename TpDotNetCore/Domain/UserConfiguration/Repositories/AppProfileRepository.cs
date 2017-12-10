using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TpDotNetCore.Data;
using TpDotNetCore.Helpers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public class AppProfileRepository : Repository<AppProfile, string>, IAppProfileRepository
    {
        public AppProfileRepository(TpContext context) : base(context)
        {
        }
        public TpContext ApplicationDataContext => Context as TpContext;

        public AppProfile FindById(string id)
        {
            try
            {
                var value = ApplicationDataContext.AppProfiles.Include(p => p.Identity).FirstOrDefault(b => b.Identity.Id == id);
                if (value == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {id} not found");
                return value;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"FindById {id} threw an exception: {exception.Message}", exception);
            }
        }
    }

}