using AutoMapper;

namespace api_snowClients
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile ()
        {
            CreateMap<Client, ClientDTO> ();
            CreateMap<Address, GetAddressDTO> ();
            CreateMap<Client, GetClientDTO> ();
        }
    }
}
