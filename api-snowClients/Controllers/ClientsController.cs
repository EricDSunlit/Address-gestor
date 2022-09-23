using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_snowClients.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.VisualBasic;

namespace api_snowClients.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly db_snowClientsContext _context;
        private readonly IMapper _mapper; 


        public ClientsController(db_snowClientsContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ClientDTO>>> GetClients()
        {
            return Ok(await _context.Clients.Select(c => _mapper.Map<ClientDTO>(c)).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetClientDTO>> GetClient(int id)
        {
            GetClientDTO? client = await _context.Clients
                                    .Where(c => c.Id == id)
                                    .Include(c => c.Addresses)
                                    .ThenInclude(a => a.Country)
                                    .Select(c => _mapper.Map<GetClientDTO>(c))
                                    .SingleOrDefaultAsync();
            
            if (client == null)
            {
                return NotFound("Client not found.");
            }

            return client;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Client>> PutClient(int id, Client client)
        {
            if (id != client.Id)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Response response = new() { Message = "Client Updated Successfully" };


            return client;
        }

        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClient", new { id = client.Id }, client);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            Response response = new() { Message = "Client Deleted Successfully"};

            return Ok(response);
        }

        [HttpPost("address")]
        public async Task<ActionResult<Client>> AddAddress(AddClientAddressDTO request)
        {
            Client? client = await _context.Clients
                                .Where(c => c.Id == request.ClientId)
                                .Include(c => c.Addresses)
                                .FirstOrDefaultAsync();
            if (client == null)
            {
                return NotFound();
            }
            Address? address = await _context.Addresses.FindAsync(request.AddressId);
            if (address == null)
            {
                return NotFound();
            }

            client.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return client;
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}
