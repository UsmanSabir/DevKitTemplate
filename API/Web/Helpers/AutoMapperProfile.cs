using Api.Web.Dtos;
using Api.Web.Entities;
using AutoMapper;

namespace Api.Web.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}