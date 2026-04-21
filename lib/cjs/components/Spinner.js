"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const react_1 = __importDefault(require("react"));
function Spinner({ active = true, size = 'medium', color = '#00a8b8', className = '', }) {
    if (!active) {
        return null;
    }
    const sizes = {
        small: { width: 16, height: 16, borderWidth: 3 },
        medium: { width: 24, height: 24, borderWidth: 3 },
        large: { width: 32, height: 32, borderWidth: 4 },
    };
    const dimensions = sizes[size];
    return (react_1.default.createElement("div", { className: className, style: {
            display: 'inline-block',
            border: `${dimensions.borderWidth}px solid transparent`,
            borderTopColor: color,
            borderRadius: '50%',
            width: dimensions.width,
            height: dimensions.height,
            animation: 'spin 1s linear infinite',
        }, role: "progressbar", "aria-busy": "true" }));
}
exports.Spinner = Spinner;
// Default export for backward compatibility
exports.default = Spinner;
//# sourceMappingURL=Spinner.js.map