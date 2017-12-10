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
			CreateMap<AppUser, UserDto>()
                .ReverseMap();
            CreateMap<AppProfile, ProfileResponseDto>()
                .ForMember(m => m.User, map => map.MapFrom(vm => vm.Identity))
                .ReverseMap();
            CreateMap<string, RoleDto>()
                .ForMember(s => s.Name, map => map.MapFrom(vm => vm))
                .ReverseMap();
            CreateMap<RefreshToken, SessionDto>()
                .ForMember(s => s.Userid, map => map.MapFrom(vm => vm.ClientId))
                .ForMember(s => s.Email, map => map.MapFrom(vm => vm.ClientName));
        }
    }
}