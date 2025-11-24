using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql.EntityFrameworkCore.PostgreSQL;

// ===== Helpers (funções locais) =====
static bool SenhaValida(string senha) =>
    System.Text.RegularExpressions.Regex.IsMatch(
        senha, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$");

static string SomenteDigitos(string s) =>
    new string(s.Where(char.IsDigit).ToArray());

static bool CpfValido(string cpf)
{
    cpf = SomenteDigitos(cpf);
    if (cpf.Length != 11) return false;
    if (new string(cpf[0], 11) == cpf) return false; 
    int CalcDig(int[] nums, int multIni)
    {
        int soma = 0, mult = multIni;
        foreach (var n in nums) soma += n * mult--;
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    var nums = cpf.Select(c => c - '0').ToArray();
    var d1 = CalcDig(nums[..9], 10);
    var d2 = CalcDig(nums[..10], 11);
    return d1 == nums[9] && d2 == nums[10];
}

var builder = WebApplication.CreateBuilder(args);

// ===== JWT =====
// Usa a mesma chave que está em appsettings.json -> "Jwt": { "Key": "..." }
var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev-secret-key-change-me";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();

// ===== DB (Postgres) =====
builder.Services.AddDbContext<AppDb>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== Swagger + JWT =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TechStore.Api", Version = "v1" });

    var jwtScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe: Bearer {seu_token}"
    };

    c.AddSecurityDefinition("Bearer", jwtScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
}); 

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TechStore.Api v1");
});

app.UseAuthentication();
app.UseAuthorization();

// ===== JWT helper =====
string GerarJwt(Cliente c)
{
    var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, c.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, c.Email),
        new Claim("name", c.NomeCompleto),
        new Claim("username", c.NomeUsuario)
    };

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// helper para pegar o ID do usuário do JWT ("sub")
int GetUserId(ClaimsPrincipal u)
{
    var sub = u.FindFirstValue("sub") ?? u.FindFirstValue(ClaimTypes.NameIdentifier);
    return int.TryParse(sub, out var id) ? id : 0;
}

// =====================================================
// ==================== ENDPOINTS ======================
// =====================================================

// ===== AUTH =====

// Registrar
app.MapPost("/api/auth/register", async (RegistrarReq req, AppDb db) =>
{
    // Validação dos campos do Cliente
    if (string.IsNullOrWhiteSpace(req.NomeCompleto) ||
        string.IsNullOrWhiteSpace(req.Email) ||
        string.IsNullOrWhiteSpace(req.Cpf) ||
        string.IsNullOrWhiteSpace(req.NomeUsuario) ||
        string.IsNullOrWhiteSpace(req.Senha))
        return Results.BadRequest("Campos de usuário (nome, email, cpf, usuário, senha) são obrigatórios.");

    // Validação dos campos do Endereço
    if (string.IsNullOrWhiteSpace(req.Cep) ||
        string.IsNullOrWhiteSpace(req.Logradouro) ||
        string.IsNullOrWhiteSpace(req.Numero) ||
        string.IsNullOrWhiteSpace(req.Bairro) ||
        string.IsNullOrWhiteSpace(req.Cidade) ||
        string.IsNullOrWhiteSpace(req.Estado))
        return Results.BadRequest("Campos de endereço (cep, logradouro, numero, bairro, cidade, estado) são obrigatórios.");

    var email = req.Email.Trim().ToLowerInvariant();
    var cpf = SomenteDigitos(req.Cpf);
    var nomeUsuario = req.NomeUsuario.Trim().ToLowerInvariant();

    if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email))
        return Results.BadRequest("E-mail inválido.");

    if (!SenhaValida(req.Senha))
        return Results.BadRequest("Senha inválida. Mínimo 8, com maiúscula, minúscula e número.");

    if (!CpfValido(cpf))
        return Results.BadRequest("CPF inválido.");

    // unicidade: email, CPF ou nome de usuário
    var jaExiste = await db.Clientes.AnyAsync(c =>
        c.Email == email || c.Cpf == cpf || c.NomeUsuario == nomeUsuario);

    if (jaExiste) return Results.Conflict("E-mail, CPF ou nome de usuário já cadastrado.");

    // 1. Cria o Cliente
    var novoCliente = new Cliente
    {
        NomeCompleto = req.NomeCompleto.Trim(),
        Email = email,
        Cpf = cpf,
        Telefone = req.Telefone?.Trim(),
        NomeUsuario = nomeUsuario,
        SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.Senha)
    };

    // 2. Cria o Endereço (principal)
    var novoEndereco = new Endereco
    {
        Apelido = (req.Apelido ?? "Principal").Trim(),
        Cep = SomenteDigitos(req.Cep),
        Logradouro = req.Logradouro.Trim(),
        Numero = req.Numero.Trim(),
        Complemento = string.IsNullOrWhiteSpace(req.Complemento) ? null : req.Complemento.Trim(),
        Bairro = req.Bairro.Trim(),
        Cidade = req.Cidade.Trim(),
        Estado = req.Estado.Trim().ToUpperInvariant(),
        Principal = true
    };

    novoCliente.Enderecos.Add(novoEndereco);

    db.Clientes.Add(novoCliente);
    await db.SaveChangesAsync();

    return Results.Created($"/api/clientes/{novoCliente.Id}",
        new RegistrarResp(novoCliente.Id, novoCliente.NomeCompleto, novoCliente.Email));
});

// Login
app.MapPost("/api/auth/login", async (LoginReq req, AppDb db) =>
{
    var email = (req.Email ?? "").Trim().ToLowerInvariant();
    var senha = req.Senha ?? "";

    var c = await db.Clientes.FirstOrDefaultAsync(x => x.Email == email);
    if (c is null) return Results.Unauthorized();

    var ok = BCrypt.Net.BCrypt.Verify(senha, c.SenhaHash);
    if (!ok) return Results.Unauthorized();

    return Results.Ok(new LoginResp(GerarJwt(c), c.NomeCompleto, c.Email));
});

// ===== CLIENTES =====

// Lista resumida de clientes (sem senha)
app.MapGet("/api/clientes", async (AppDb db) =>
{
    var lista = await db.Clientes
        .OrderByDescending(c => c.CriadoEm)
        .Select(c => new ClienteListItem(
            c.Id, c.NomeCompleto, c.Email, c.NomeUsuario, c.CriadoEm))
        .ToListAsync();

    return Results.Ok(lista);
});

// Detalhe por ID (sem senha)
app.MapGet("/api/clientes/{id:int}", async (int id, AppDb db) =>
{
    var cliente = await db.Clientes
        .Where(c => c.Id == id)
        .Select(c => new ClienteDetalheResp(
            c.Id, c.NomeCompleto, c.Email, c.Cpf, c.Telefone,
            c.NomeUsuario, c.CriadoEm))
        .FirstOrDefaultAsync();

    return cliente is null ? Results.NotFound() : Results.Ok(cliente);
});

// Deletar cliente
app.MapDelete("/api/clientes/{id:int}", async (int id, AppDb db) =>
{
    var cliente = await db.Clientes.FindAsync(id);
    if (cliente is null) return Results.NotFound();

    db.Clientes.Remove(cliente);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Atualizar dados básicos do cliente (sem senha, sem endereço)
app.MapPut("/api/clientes/{id:int}", async (int id, AppDb db, ClienteUpdateReq req) =>
{
    var c = await db.Clientes.FindAsync(id);
    if (c is null) return Results.NotFound();

    c.NomeCompleto = (req.NomeCompleto ?? c.NomeCompleto).Trim();
    c.Telefone = req.Telefone?.Trim();

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ===== CONTA (autenticado) =====

var conta = app.MapGroup("/api/conta").RequireAuthorization();

// PATCH /api/conta/senha
conta.MapPatch("/senha", async (ClaimsPrincipal user, AppDb db, PasswordChangeReq req) =>
{
    if (string.IsNullOrWhiteSpace(req.SenhaAtual) || string.IsNullOrWhiteSpace(req.NovaSenha))
        return Results.BadRequest("Senha atual e nova senha são obrigatórias.");

    var uid = GetUserId(user);
    var c = await db.Clientes.FindAsync(uid);
    if (c is null) return Results.Unauthorized();

    if (!BCrypt.Net.BCrypt.Verify(req.SenhaAtual, c.SenhaHash))
        return Results.BadRequest("Senha atual inválida.");

    if (!SenhaValida(req.NovaSenha))
        return Results.BadRequest("Senha inválida. Mínimo 8, com maiúscula, minúscula e número.");

    c.SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.NovaSenha);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ===== ENDEREÇOS (autenticado) =====

var enderecos = app.MapGroup("/api/enderecos").RequireAuthorization();

// GET /api/enderecos
enderecos.MapGet("/", async (ClaimsPrincipal user, AppDb db) =>
{
    var uid = GetUserId(user);
    var lista = await db.Enderecos
        .Where(e => e.ClienteId == uid)
        .OrderByDescending(e => e.Principal)
        .Select(e => new EnderecoResp(
            e.Id, e.Apelido, e.Cep, e.Logradouro, e.Numero,
            e.Complemento, e.Bairro, e.Cidade, e.Estado, e.Principal))
        .ToListAsync();

    return Results.Ok(lista);
});

// POST /api/enderecos
enderecos.MapPost("/", async (ClaimsPrincipal user, AppDb db, EnderecoReq req) =>
{
    var uid = GetUserId(user);
    if (uid == 0) return Results.Unauthorized();

    if (string.IsNullOrWhiteSpace(req.Cep) ||
        string.IsNullOrWhiteSpace(req.Logradouro) ||
        string.IsNullOrWhiteSpace(req.Numero) ||
        string.IsNullOrWhiteSpace(req.Bairro) ||
        string.IsNullOrWhiteSpace(req.Cidade) ||
        string.IsNullOrWhiteSpace(req.Estado))
        return Results.BadRequest("Preencha os campos obrigatórios.");

    var jaTemEndereco = await db.Enderecos.AnyAsync(e => e.ClienteId == uid);

    var novo = new Endereco
    {
        ClienteId = uid,
        Apelido = (req.Apelido ?? "Endereço").Trim(),
        Cep = new string((req.Cep ?? "").Where(char.IsDigit).Take(8).ToArray()),
        Logradouro = req.Logradouro.Trim(),
        Numero = req.Numero.Trim(),
        Complemento = string.IsNullOrWhiteSpace(req.Complemento) ? null : req.Complemento.Trim(),
        Bairro = req.Bairro.Trim(),
        Cidade = req.Cidade.Trim(),
        Estado = (req.Estado ?? "").Trim().ToUpperInvariant(),
        Principal = !jaTemEndereco ? true : req.Principal
    };

    if (novo.Principal)
    {
        var outros = db.Enderecos.Where(e => e.ClienteId == uid && e.Principal);
        await outros.ForEachAsync(e => e.Principal = false);
    }

    db.Enderecos.Add(novo);
    await db.SaveChangesAsync();

    var resp = new EnderecoResp(
        novo.Id, novo.Apelido, novo.Cep, novo.Logradouro, novo.Numero,
        novo.Complemento, novo.Bairro, novo.Cidade, novo.Estado, novo.Principal);

    return Results.Created($"/api/enderecos/{novo.Id}", resp);
});

// PUT /api/enderecos/{id}
enderecos.MapPut("/{id:int}", async (int id, ClaimsPrincipal user, AppDb db, EnderecoReq req) =>
{
    var uid = GetUserId(user);
    var e = await db.Enderecos.FirstOrDefaultAsync(x => x.Id == id && x.ClienteId == uid);
    if (e is null) return Results.NotFound();

    e.Apelido = (req.Apelido ?? e.Apelido)?.Trim();
    e.Cep = new string((req.Cep ?? e.Cep).Where(char.IsDigit).Take(8).ToArray());
    e.Logradouro = req.Logradouro.Trim();
    e.Numero = req.Numero.Trim();
    e.Complemento = string.IsNullOrWhiteSpace(req.Complemento) ? null : req.Complemento.Trim();
    e.Bairro = req.Bairro.Trim();
    e.Cidade = req.Cidade.Trim();
    e.Estado = (req.Estado ?? e.Estado).Trim().ToUpperInvariant();

    if (req.Principal && !e.Principal)
    {
        var outros = db.Enderecos.Where(x => x.ClienteId == uid && x.Principal);
        await outros.ForEachAsync(x => x.Principal = false);
        e.Principal = true;
    }
    else if (!req.Principal && e.Principal)
    {
        e.Principal = true; 
    }

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE /api/enderecos/{id}
enderecos.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, AppDb db) =>
{
    var uid = GetUserId(user);
    var e = await db.Enderecos.FirstOrDefaultAsync(x => x.Id == id && x.ClienteId == uid);
    if (e is null) return Results.NotFound();

    var eraPrincipal = e.Principal;

    db.Enderecos.Remove(e);
    await db.SaveChangesAsync();

    if (eraPrincipal)
    {
        var novoPrincipal = await db.Enderecos
            .Where(x => x.ClienteId == uid)
            .FirstOrDefaultAsync();

        if (novoPrincipal is not null)
        {
            novoPrincipal.Principal = true;
            await db.SaveChangesAsync();
        }
    }

    return Results.NoContent();
});

app.Run();

// ===== DEFINIÇÕES DE TIPOS (RECORDS) USADOS NOS ENDPOINTS ACIMA =====
public record ClienteUpdateReq(string NomeCompleto, string? Telefone);
