using Microsoft.AspNetCore.Http;
using TpDotNetCore.Domain.Punches.Repositories;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using TpDotNetCore.Helpers;

namespace TpDotNetCore.Domain.Punches
{
    public class PunchService : IPunchService
    {
        private IPunchRepository PunchRepository { get; set; }
        private IAppUserRepository AppUserRepository { get; set; }

        public PunchService(IPunchRepository punchRepository, IAppUserRepository appUserRepository)
        {
            this.PunchRepository = punchRepository;
            this.AppUserRepository = appUserRepository;
        }

        public void UpdatePunch(Punch punchEntity, string userId)
        {
            var user = AppUserRepository.FindByName(userId);
            if (user == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");
            var punch = PunchRepository.GetByUser(punchEntity, user);
            if (punch == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"Punch {punchEntity.Id} of User {userId} not found");
            PunchRepository.Update(punchEntity);
        }
        
        public void DeletePunch(Punch punchEntity, string userId)
        {
            var user = AppUserRepository.FindByName(userId);
            if (user == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"User {userId} not found");
            var punch = PunchRepository.GetByUser(punchEntity, user);
            if (punch == null)
                throw new RepositoryException(StatusCodes.Status404NotFound, $"Punch {punchEntity.Id} of User {userId} not found");
            PunchRepository.Delete(punchEntity);
        }
    }
}