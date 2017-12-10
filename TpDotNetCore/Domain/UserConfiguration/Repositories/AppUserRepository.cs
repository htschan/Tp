using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Data;
using TpDotNetCore.Helpers;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public class AppUserRepository : Repository<AppUser, string>, IAppUserRepository
    {
        public AppUserRepository(TpContext context) : base(context)
        {
        }
        public TpContext ApplicationDataContext => Context as TpContext;

        public AppUser FindByName(string userName)
        {
            try
            {
                var value = Context.AppUsers.FirstOrDefault(b => b.UserName == userName);
                if (value == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userName} not found");
                return value;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"FindByName {userName} threw an exception: {exception.Message}", exception);
            }
        }

        public AppUser FindById(string userId)
        {
            try
            {
                var value = Context.AppUsers.FirstOrDefault(b => b.Id == userId);
                if (value == null)
                    throw new RepositoryException(StatusCodes.Status404NotFound, $"User Id {userId} not found");
                return value;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception exception)
            {
                throw new RepositoryException(StatusCodes.Status400BadRequest, $"FindByName {userId} threw an exception: {exception.Message}", exception);
            }
        }
    }
}