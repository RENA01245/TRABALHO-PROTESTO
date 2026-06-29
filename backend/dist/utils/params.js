"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamId = getParamId;
function getParamId(params) {
    const id = params.id;
    return Array.isArray(id) ? id[0] : id;
}
//# sourceMappingURL=params.js.map