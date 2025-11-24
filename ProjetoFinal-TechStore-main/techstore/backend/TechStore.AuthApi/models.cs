using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

// ===== MODELOS =====

public class Cliente
{
    public int Id { get; set; }

    [Required, MaxLength(140)]
    public string NomeCompleto { get; set; } = default!;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = default!;

    [Required, MaxLength(11)]
    public string Cpf { get; set; } = default!;

    [MaxLength(20)]
    public string? Telefone { get; set; } 

    [Required, MaxLength(50)] 
    public string NomeUsuario { get; set; } = default!;


    // Segurança
    [Required]
    public string SenhaHash { get; set; } = default!;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // Propriedade de navegação para os endereços do cliente
    public List<Endereco> Enderecos { get; set; } = new();
}

public class Endereco
{
    public int Id { get; set; }
    public int ClienteId { get; set; }

    [MaxLength(50)] 
    public string? Apelido { get; set; } // "Casa", "Trabalho"...

    [Required, MaxLength(8)]
    public string Cep { get; set; } = default!;

    [Required, MaxLength(120)]
    [Column("rua")] // Mapeia esta propriedade para a coluna "rua" no SQL
    public string Logradouro { get; set; } = default!;

    [Required, MaxLength(20)] 
    public string Numero { get; set; } = default!;

    [MaxLength(120)] 
    public string? Complemento { get; set; }

    [Required, MaxLength(120)] 
    public string Bairro { get; set; } = default!;

    [Required, MaxLength(120)] 
    public string Cidade { get; set; } = default!;

    [Required, MaxLength(2)]
    public string Estado { get; set; } = default!;

    public bool Principal { get; set; } = false;
    
    
}

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> opt) : base(opt) { }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Endereco> Enderecos => Set<Endereco>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ====== CLIENTE → tabela "clientes" ======
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("clientes"); 

            entity.Property(c => c.Id).HasColumnName("id");
            entity.Property(c => c.NomeCompleto).HasColumnName("nome_completo");
            entity.Property(c => c.Email).HasColumnName("email");
            entity.Property(c => c.Cpf).HasColumnName("cpf");
            entity.Property(c => c.Telefone).HasColumnName("telefone");
            entity.Property(c => c.NomeUsuario).HasColumnName("nome_usuario");
            entity.Property(c => c.SenhaHash).HasColumnName("senha_hash");
            entity.Property(c => c.CriadoEm).HasColumnName("criado_em");

            // Índices/constraints de unicidade (regras de negócio)
            entity.HasIndex(c => c.Email).IsUnique();
            entity.HasIndex(c => c.Cpf).IsUnique();
            entity.HasIndex(c => c.NomeUsuario).IsUnique();

            // Relação 1:N Cliente → Endereços
            entity.HasMany(c => c.Enderecos)
                  .WithOne() 
                  .HasForeignKey(e => e.ClienteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ====== ENDERECO → tabela "enderecos" ======
        modelBuilder.Entity<Endereco>(entity =>
        {
            entity.ToTable("enderecos");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClienteId).HasColumnName("cliente_id");
            entity.Property(e => e.Apelido).HasColumnName("apelido");
            entity.Property(e => e.Cep).HasColumnName("cep");
            entity.Property(e => e.Logradouro).HasColumnName("rua"); 
            entity.Property(e => e.Numero).HasColumnName("numero");
            entity.Property(e => e.Complemento).HasColumnName("complemento");
            entity.Property(e => e.Bairro).HasColumnName("bairro");
            entity.Property(e => e.Cidade).HasColumnName("cidade");
            entity.Property(e => e.Estado).HasColumnName("estado");
            entity.Property(e => e.Principal).HasColumnName("principal");
        });
    }
}


// ===== DTOs =====

// DTO para registrar um NOVO cliente + seu PRIMEIRO endereço
public record RegistrarReq(
    // Dados Cliente
    string NomeCompleto,
    string Email,
    string Cpf,
    string? Telefone,
    string NomeUsuario,
    string Senha,

    // Dados do Primeiro Endereço
    string? Apelido,
    string Cep,
    string Logradouro, // "Rua"
    string Numero,
    string? Complemento,
    string Bairro,
    string Cidade,
    string Estado
);

// DTO para adicionar um NOVO endereço a um cliente existente
public record EnderecoReq(
    string? Apelido,
    string Cep,
    string Logradouro,
    string Numero,
    string? Complemento,
    string Bairro,
    string Cidade,
    string Estado,
    bool Principal
);

// DTO para exibir um endereço
public record EnderecoResp(
    int Id,
    string? Apelido,
    string Cep,
    string Logradouro,
    string Numero,
    string? Complemento,
    string Bairro,
    string Cidade,
    string Estado,
    bool Principal
);

// DTO para listar clientes (sem dados sensíveis ou complexos)
public record ClienteListItem(
    int Id,
    string NomeCompleto,
    string Email,
    string NomeUsuario,
    DateTime CriadoEm
);

// DTO para ver os detalhes de UM cliente
public record ClienteDetalheResp(
    int Id,
    string NomeCompleto,
    string Email,
    string Cpf,
    string? Telefone,
    string NomeUsuario,
    DateTime CriadoEm
    
   
);


public record RegistrarResp(int Id, string NomeCompleto, string Email);
public record LoginReq(string Email, string Senha);
public record LoginResp(string Token, string NomeCompleto, string Email);
public record PasswordChangeReq(string SenhaAtual, string NovaSenha);