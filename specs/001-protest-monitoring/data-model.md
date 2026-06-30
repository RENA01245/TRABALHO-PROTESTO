# Data Model

## User

Campos: id, name, email, passwordHash, role, active, createdAt, updatedAt.

## ImportBatch

Representa um arquivo importado. Relaciona usuario importador, erros e protestos.

Campos: id, fileName, fileType, importedById, totalRecords, validRecords, invalidRecords, status, createdAt.

## ImportError

Erro de linha/campo durante importacao.

Campos: id, importBatchId, lineNumber, field, message, rawContent, createdAt.

## Debtor

Devedor importado.

Campos: id, name, document, documentType, address, city, state, zipCode, createdAt, updatedAt.

## Creditor

Credor importado.

Campos: id, name, document, documentType, createdAt, updatedAt.

## Protest

Protesto monitorado.

Campos: id, protocol, titleNumber, debtorId, creditorId, importBatchId, amount, dueDate, presentationDate, status, paymentStatus, hasBoleto, boletoDueDate, boletoAmount, notes, createdAt, updatedAt.

## ProtestAttachment

Anexo do protesto.

Campos: id, protestId, fileName, fileUrl, fileType, attachmentType, uploadedById, createdAt.

## ProtestHistory

Historico operacional.

Campos: id, protestId, userId, action, oldValue, newValue, description, createdAt.

## PaymentInfo

Pagamento vinculado ao protesto.

Campos: id, protestId, amount, paymentDate, paymentMethod, status, notes, createdAt.
