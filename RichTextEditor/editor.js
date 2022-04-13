"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.execCommandStyle = void 0;
function execCommandStyle(action, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var selection, anchorNode, container, sameSelection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSelection()];
                case 1:
                    selection = _a.sent();
                    if (!selection)
                        return [2 /*return*/];
                    anchorNode = selection.anchorNode;
                    if (!anchorNode) {
                        return [2 /*return*/];
                    }
                    container = anchorNode.nodeType !== Node.TEXT_NODE
                        && anchorNode.nodeType !== Node.COMMENT_NODE ? anchorNode : anchorNode.parentElement;
                    sameSelection = container && container.innerText === selection.toString();
                    if (!(sameSelection && !isContainer(containers, container) && container.style[action.style] !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateSelection(container, action, containers)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, replaceSelection(container, action, selection, containers)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.execCommandStyle = execCommandStyle;
function getSelection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (window && window.getSelection) {
                return [2 /*return*/, window.getSelection()];
            }
            else if (document && document.getSelection) {
                return [2 /*return*/, document.getSelection()];
            }
            else if (document && document.selection) {
                return [2 /*return*/, document.selection.createRange().text];
            }
            return [2 /*return*/, null];
        });
    });
}
function updateSelection(container, action, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = container.style;
                    _b = action.style;
                    return [4 /*yield*/, getStyleValue(container, action, containers)];
                case 1:
                    _a[_b] = _c.sent();
                    return [4 /*yield*/, cleanChildren(action, container)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getStyleValue(container, action, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var style;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!container) {
                        return [2 /*return*/, action.value];
                    }
                    return [4 /*yield*/, action.initial(container)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, 'initial'];
                    }
                    return [4 /*yield*/, findStyleNode(container, action.style, containers)];
                case 2:
                    style = _a.sent();
                    return [4 /*yield*/, action.initial(style)];
                case 3:
                    if (_a.sent()) {
                        return [2 /*return*/, 'initial'];
                    }
                    return [2 /*return*/, action.value];
            }
        });
    });
}
// Recursively iterates till it either find an element with the same
// style or the container
function findStyleNode(node, style, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var hasStyle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Just in case
                    if (node.nodeName.toUpperCase() === 'HTML' ||
                        node.nodeName.toUpperCase() === 'BODY') {
                        return [2 /*return*/, null];
                    }
                    if (!node.parentNode) {
                        return [2 /*return*/, null];
                    }
                    if (isContainer(containers, node)) {
                        return [2 /*return*/, null];
                    }
                    hasStyle = node.style[style] !== null &&
                        node.style[style] !== undefined &&
                        node.style[style] !== '';
                    if (hasStyle) {
                        return [2 /*return*/, node];
                    }
                    return [4 /*yield*/, findStyleNode(node.parentNode, style, containers)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function cleanChildren(action, span) {
    return __awaiter(this, void 0, void 0, function () {
        var children, cleanChildrenChildren;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!span.hasChildNodes()) {
                        return [2 /*return*/];
                    }
                    children = Array.from(span.children)
                        .filter(function (element) {
                        return element.style[action.style] !== undefined &&
                            element.style[action.style] !== '';
                    });
                    if (children && children.length > 0) {
                        children.forEach(function (element) {
                            element.style[action.style] = '';
                            if (element.getAttribute('style') === '' ||
                                element.style === null) {
                                element.removeAttribute('style');
                            }
                        });
                    }
                    cleanChildrenChildren = Array.from(span.children).map(function (element) {
                        return cleanChildren(action, element);
                    });
                    if (!cleanChildrenChildren || cleanChildrenChildren.length <= 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(cleanChildrenChildren)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function isContainer(containers, element) {
    var containerTypes = containers.toLowerCase().split(',');
    return element && element.nodeName && containerTypes.indexOf(element.nodeName.toLowerCase()) > -1;
}
function replaceSelection(container, action, selection, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var range, fragment, span;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    range = selection.getRangeAt(0);
                    fragment = range.extractContents();
                    return [4 /*yield*/, createSpan(container, action, containers)];
                case 1:
                    span = _a.sent();
                    span.appendChild(fragment);
                    return [4 /*yield*/, cleanChildren(action, span)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, flattenChildren(action, span)];
                case 3:
                    _a.sent();
                    range.insertNode(span);
                    selection.selectAllChildren(span);
                    return [2 /*return*/];
            }
        });
    });
}
function createSpan(container, action, containers) {
    return __awaiter(this, void 0, void 0, function () {
        var span, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    span = document.createElement('span');
                    _a = span.style;
                    _b = action.style;
                    return [4 /*yield*/, getStyleValue(container, action, containers)];
                case 1:
                    _a[_b] =
                        _c.sent();
                    return [2 /*return*/, span];
            }
        });
    });
}
function flattenChildren(action, span) {
    return __awaiter(this, void 0, void 0, function () {
        var children, flattenChildrenChildren;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!span.hasChildNodes()) {
                        return [2 /*return*/];
                    }
                    children = Array.from(span.children).filter(function (element) {
                        var style = element.getAttribute('style');
                        return !style || style === '';
                    });
                    if (children && children.length > 0) {
                        children.forEach(function (element) {
                            var styledChildren = element.querySelectorAll('[style]');
                            if (!styledChildren || styledChildren.length === 0) {
                                var text = document.createTextNode(element.textContent);
                                element.parentElement.replaceChild(text, element);
                            }
                        });
                        return [2 /*return*/];
                    }
                    flattenChildrenChildren = Array.from(span.children).map(function (element) {
                        return flattenChildren(action, element);
                    });
                    if (!flattenChildrenChildren ||
                        flattenChildrenChildren.length <= 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(flattenChildrenChildren)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
