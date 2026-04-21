"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lincdServerUtils = exports.Lincd_API_Client = exports._self = exports.ns = exports.loadData = void 0;
const Prefix_1 = require("@_linked/core/utils/Prefix");
const NameSpace_1 = require("@_linked/core/utils/NameSpace");
const package_js_1 = require("../package.js");
//import all the exports of this file as one variable called _this (we need this at the end)
const _this = __importStar(require("./lincd-server-utils.js"));
/**
 * Load the data of this ontology into memory, thus adding the properties of the entities of this ontology to the local graph.
 */
var loadData = () => {
    if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
        // CommonJS import
        return Promise.resolve().then(() => __importStar(require('../data/lincd-server-utils.json')));
    }
    else {
        // ESM import
        //@ts-ignore
        return Promise.resolve().then(() => __importStar(require('../data/lincd-server-utils.json'))).then((data) => data.default);
    }
};
exports.loadData = loadData;
/**
 * The namespace of this ontology, which can be used to create NamedNodes with URI's not listed in this file
 */
exports.ns = (0, NameSpace_1.createNameSpace)('http://lincd.org/ont/lincd-server-utils/');
Prefix_1.Prefix.add('lincd-server-utils', 'http://lincd.org/ont/lincd-server-utils/');
/**
 * The NamedNode of the ontology itself
 */
exports._self = (0, exports.ns)('');
//A list of all the entities (Classes & Properties) of this ontology, each exported as a NamedNode
exports.Lincd_API_Client = (0, exports.ns)('Lincd_API_Client');
//An extra grouping object so all the entities can be accessed from the prefix/name
exports.lincdServerUtils = {
    Lincd_API_Client: exports.Lincd_API_Client,
};
//Registers this ontology to LINCD.JS, so that data loading can be automated amongst other things
(0, package_js_1.linkedOntology)(_this, exports.ns, 'lincd-server-utils', exports.loadData, '../data/lincd-server-utils.json');
//# sourceMappingURL=lincd-server-utils.js.map