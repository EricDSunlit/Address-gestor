namespace api_snowClients.Models
{
    public class GetAddressDTO
    {
        public int Id { get; set; }
        public string AddressLine1 { get; set; } = null!;
        public string? AddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public string Region { get; set; } = null!;
        public string PostalCode { get; set; } = null!;

        public virtual Country? Country { get; set; }

    }
}
