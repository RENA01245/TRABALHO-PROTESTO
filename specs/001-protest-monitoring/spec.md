# Feature Specification: Sistema de Monitoramento de Protestos Importados

**Feature Branch**: `001-protest-monitoring`
**Created**: 2026-06-29
**Status**: Implemented
**Input**: Sistema academico de monitoramento de protestos importados por arquivo, com dashboard, filtros, detalhes, boleto, pagamento, historico e Supabase PostgreSQL.

## User Scenarios & Testing

### User Story 1 - Importar Protestos Por Arquivo (Priority: P1)

Como funcionario autenticado, quero importar um arquivo CSV de protestos para que o sistema crie lote, credores, devedores e protestos automaticamente.

**Why this priority**: A importacao e o foco central do novo escopo.

**Independent Test**: Enviar `backend/examples/protestos-exemplo.csv` em `/importar` e confirmar resumo de importacao e novos protestos na listagem.

**Acceptance Scenarios**:

1. **Given** usuario autenticado, **When** seleciona CSV valido e clica em importar, **Then** o sistema cria `ImportBatch`, protestos e historico.
2. **Given** arquivo invalido, **When** tenta importar, **Then** o sistema exibe mensagem clara de erro.
3. **Given** linha invalida em CSV, **When** importa arquivo, **Then** o sistema registra `ImportError`.

### User Story 2 - Monitorar e Filtrar Protestos (Priority: P2)

Como usuario autenticado, quero consultar protestos por protocolo, documento, nome, status e datas para acompanhar pendencias.

**Why this priority**: Consulta e monitoramento sao necessarios apos a importacao.

**Independent Test**: Acessar `/protestos`, usar filtros e abrir detalhes.

**Acceptance Scenarios**:

1. **Given** protestos importados, **When** filtro por protocolo, **Then** apenas registros correspondentes aparecem.
2. **Given** protestos importados, **When** filtro por status, **Then** a tabela atualiza com badges corretas.

### User Story 3 - Gerenciar Detalhes, Boleto e Pagamento (Priority: P3)

Como funcionario, quero abrir um protesto, alterar status, anexar boleto e registrar pagamento para manter o historico operacional.

**Why this priority**: Completa o ciclo de monitoramento do protesto.

**Independent Test**: Acessar `/protestos/:id`, anexar `backend/examples/boleto-exemplo.pdf`, registrar pagamento e conferir historico.

**Acceptance Scenarios**:

1. **Given** protesto existente, **When** altero status, **Then** o status e o historico sao atualizados.
2. **Given** protesto existente, **When** anexo boleto, **Then** o anexo aparece na tela e o historico registra `ANEXO_BOLETO`.
3. **Given** protesto existente, **When** registro pagamento, **Then** `PaymentInfo` e `paymentStatus` sao atualizados.

## Edge Cases

- Arquivo sem registros deve retornar erro.
- Arquivo com cabecalho incompleto deve listar campos ausentes.
- CSV com valores invalidos deve registrar erro por linha.
- Status desconhecido deve ser rejeitado.
- Rotas protegidas devem bloquear usuarios sem JWT.
- Layout SIMPROT/CRA permanece (A DEFINIR).

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST autenticar usuarios com JWT e Bcrypt.
- **FR-002**: O sistema MUST importar CSV por `multipart/form-data`.
- **FR-003**: O sistema MUST criar `ImportBatch` para cada arquivo importado.
- **FR-004**: O sistema MUST registrar `ImportError` para linhas invalidas.
- **FR-005**: O sistema MUST criar ou atualizar credores, devedores e protestos validos.
- **FR-006**: O sistema MUST permitir filtros por protocolo, CPF/CNPJ, nome, status e intervalo de datas.
- **FR-007**: O sistema MUST permitir alterar status de protesto.
- **FR-008**: O sistema MUST permitir anexar boleto ou documento.
- **FR-009**: O sistema MUST permitir registrar pagamento.
- **FR-010**: O sistema MUST registrar historico de importacao, status, boleto e pagamento.
- **FR-011**: O sistema MUST exibir dashboard com indicadores por status.
- **FR-012**: O sistema MUST usar PostgreSQL no Supabase com Prisma.

### Key Entities

- **User**: usuario administrador ou funcionario.
- **ImportBatch**: lote de arquivo importado.
- **ImportError**: erro por linha/campo do arquivo.
- **Debtor**: devedor importado.
- **Creditor**: credor importado.
- **Protest**: protesto monitorado.
- **ProtestAttachment**: boleto, comprovante ou documento.
- **ProtestHistory**: historico operacional.
- **PaymentInfo**: registro de pagamento.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Usuario consegue importar o CSV de exemplo em menos de 1 minuto.
- **SC-002**: Protestos validos aparecem na listagem apos importacao.
- **SC-003**: Filtros por protocolo, documento, nome e status retornam resultados corretos.
- **SC-004**: Boleto e pagamento aparecem no historico apos salvamento.
- **SC-005**: Builds de backend e frontend passam sem erros.

## Assumptions

- CSV e o formato principal para teste academico.
- Layout SIMPROT/CRA real ainda esta (A DEFINIR).
- Supabase Storage e opcional; sem configuracao, anexos usam URL local de teste.
- O projeto usa tabela propria de usuarios, nao Supabase Auth.
