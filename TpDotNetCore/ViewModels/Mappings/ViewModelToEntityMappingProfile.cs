using AutoMapper;
using TpDotNetCore.Controllers;
using TpDotNetCore.Entities;

namespace TpDotNetCore.ViewModels.Mappings
{
    public class ViewModelToEntityMappingProfile : Profile
    {
        public ViewModelToEntityMappingProfile()
        {
            CreateMap<RegisterVm, User>().ForMember(au => au.UserName, map => map.MapFrom(vm => vm.Email));
        }
    }
}