using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Data;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public class AppUserRepository : IAppUserRepository
    {
        private readonly TpContext _appDbContext;
        public AppUserRepository(TpContext context)
        {
            _appDbContext = context;
        }

        public void Delete(AppUser entity)
        {
            throw new NotImplementedException();
        }

        public AppUser FindByName(string userName)
        {
            try
            {
                var value = _appDbContext.AppUsers.FirstOrDefault(b => b.UserName == userName);
                if (value == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userName} not found");
                return value;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (System.Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"FindByName {userName} threw an exception: {exception.Message}", exception);
            }
        }

        public System.Collections.Generic.IList<AppUser> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Insert(AppUser entity)
        {
            throw new NotImplementedException();
        }

        public void Update(AppUser entity)
        {
            throw new NotImplementedException();
        }
    }
}