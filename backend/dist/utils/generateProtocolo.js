"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProtocolo = generateProtocolo;
const database_1 = require("../config/database");
async function generateProtocolo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    const prefix = `PROT-${datePrefix}-`;
    const lastTitulo = await database_1.prisma.titulo.findFirst({
        where: {
            protocolo: {
                startsWith: prefix,
            },
        },
        orderBy: {
            protocolo: 'desc',
        },
    });
    let sequence = 1;
    if (lastTitulo) {
        const lastSequence = parseInt(lastTitulo.protocolo.split('-')[2], 10);
        sequence = lastSequence + 1;
    }
    const sequenceStr = String(sequence).padStart(5, '0');
    return `${prefix}${sequenceStr}`;
}
//# sourceMappingURL=generateProtocolo.js.map