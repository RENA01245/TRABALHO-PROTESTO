import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const senhaHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@protesto.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@protesto.com',
      senha: senhaHash,
      role: 'ADMIN',
      ativo: true,
    },
  });

  const funcionarioSenha = await bcrypt.hash('func123', 10);
  await prisma.usuario.upsert({
    where: { email: 'funcionario@protesto.com' },
    update: {},
    create: {
      nome: 'Funcionário Teste',
      email: 'funcionario@protesto.com',
      senha: funcionarioSenha,
      role: 'FUNCIONARIO',
      ativo: true,
    },
  });

  const credor = await prisma.credor.upsert({
    where: { documento: '12345678000195' },
    update: {},
    create: {
      nome: 'Empresa Credora LTDA',
      documento: '12345678000195',
      tipoDocumento: 'CNPJ',
      email: 'credor@empresa.com',
      telefone: '(11) 99999-0001',
      endereco: 'Rua das Flores, 100 - São Paulo/SP',
    },
  });

  const devedor = await prisma.devedor.upsert({
    where: { documento: '52998224725' },
    update: {},
    create: {
      nome: 'João Silva Devedor',
      documento: '52998224725',
      tipoDocumento: 'CPF',
      email: 'joao.devedor@email.com',
      telefone: '(11) 98888-0002',
      endereco: 'Av. Paulista, 500 - São Paulo/SP',
    },
  });

  const protocoloExistente = await prisma.titulo.findFirst({
    where: { protocolo: { startsWith: 'PROT-' } },
  });

  if (!protocoloExistente) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const protocolo = `PROT-${year}${month}${day}-00001`;

    const titulo = await prisma.titulo.create({
      data: {
        protocolo,
        credorId: credor.id,
        devedorId: devedor.id,
        valor: 1500.0,
        dataVencimento: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        tipoTitulo: 'Duplicata Mercantil',
        status: 'PENDENTE',
        observacoes: 'Título de exemplo criado pelo seed',
      },
    });

    await prisma.historicoTitulo.create({
      data: {
        tituloId: titulo.id,
        usuarioId: admin.id,
        acao: 'CREATE',
        valorNovo: `Protocolo ${protocolo} criado com status PENDENTE`,
      },
    });

    console.log(`Título de exemplo criado: ${protocolo}`);
  }

  console.log('Seed concluído com sucesso!');
  console.log('Usuário admin: admin@protesto.com / admin123');
  console.log('Usuário funcionário: funcionario@protesto.com / func123');
}

main()
  .catch((error) => {
    console.error('Erro no seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
