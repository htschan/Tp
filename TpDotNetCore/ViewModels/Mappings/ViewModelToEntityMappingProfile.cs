using AutoMapper;
using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.Punches;
using TpDotNetCore.Domain.UserConfiguration;

namespace TpDotNetCore.ViewModels.Mappings
{
    public class ViewModelToEntityMappingProfile : Profile
    {
        public ViewModelToEntityMappingProfile()
        {
            //       <Destination, Source>
            CreateMap<RegisterDto, AppUser>().ForMember(au => au.UserName, map => map.MapFrom(dto => dto.Email));
            CreateMap<DeletePunchDto, Punch>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Punchid));
            // CreateMap<Punch, DeletePunchDto>()
            //     .ForMember(dest => dest.Punchid, opt => opt.MapFrom(src => src.Id));
        }
    }
}