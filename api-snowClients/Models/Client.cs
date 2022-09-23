using System;
using System.Collections.Generic;

namespace api_snowClients.Models
{
    public partial class Client
    {
        public Client()
        {
            Addresses = new HashSet<Address>();
        }

        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public decimal Phone { get; set; }

        public virtual ICollection<Address> Addresses { get; set; }
    }
}
