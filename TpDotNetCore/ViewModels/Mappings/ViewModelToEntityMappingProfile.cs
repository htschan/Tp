using AutoMapper;
using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.UserConfiguration;

namespace TpDotNetCore.ViewModels.Mappings
{
    public class ViewModelToEntityMappingProfile : Profile
    {
        public ViewModelToEntityMappingProfile()
        {
            CreateMap<RegisterDto, AppUser>().ForMember(au => au.UserName, map => map.MapFrom(dto => dto.Email));
        }
    }
}