using System;
using System.Text.Json.Serialization;

namespace api_snowClients.Models
{
    public partial class Address
    {
        public Address()
        {
            Clients = new HashSet<Client>();
        }

        public int Id { get; set; }
        public string AddressLine1 { get; set; } = null!;
        public string? AddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public string Region { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
        public int? CountryId { get; set; }

        public virtual Country? Country { get; set; }

        [JsonIgnore]
        public virtual ICollection<Client> Clients { get; set; }
    }
}
