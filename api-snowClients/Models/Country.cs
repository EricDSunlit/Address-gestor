using System;
using System.Text.Json.Serialization;

namespace api_snowClients.Models
{
    public partial class Country
    {
        public Country()
        {
            Addresses = new HashSet<Address>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore]
        public virtual ICollection<Address> Addresses { get; set; }
    }
}
