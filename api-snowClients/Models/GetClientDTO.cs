namespace api_snowClients.Models
{
    public class GetClientDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public decimal Phone { get; set; }

        public virtual ICollection<GetAddressDTO>? Addresses { get; set; }

    }
}
