/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./styles/Header.module.css":
/*!**********************************!*\
  !*** ./styles/Header.module.css ***!
  \**********************************/
/***/ ((module) => {

eval("// Exports\nmodule.exports = {\n\t\"header\": \"Header_header__072v2\",\n\t\"headerContent\": \"Header_headerContent__z8t4c\",\n\t\"logo\": \"Header_logo__0dir7\",\n\t\"nav\": \"Header_nav__evgr5\",\n\t\"navList\": \"Header_navList__Xi2gf\",\n\t\"navLink\": \"Header_navLink__bzbwi\",\n\t\"active\": \"Header_active__3IUjt\",\n\t\"signOutBtn\": \"Header_signOutBtn__uOtGp\",\n\t\"menuToggle\": \"Header_menuToggle__0MPgd\",\n\t\"navOpen\": \"Header_navOpen__Prshy\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdHlsZXMvSGVhZGVyLm1vZHVsZS5jc3MiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdWJvbC1sZWFybmluZy1wbGF0Zm9ybS8uL3N0eWxlcy9IZWFkZXIubW9kdWxlLmNzcz9lZjg1Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRcImhlYWRlclwiOiBcIkhlYWRlcl9oZWFkZXJfXzA3MnYyXCIsXG5cdFwiaGVhZGVyQ29udGVudFwiOiBcIkhlYWRlcl9oZWFkZXJDb250ZW50X196OHQ0Y1wiLFxuXHRcImxvZ29cIjogXCJIZWFkZXJfbG9nb19fMGRpcjdcIixcblx0XCJuYXZcIjogXCJIZWFkZXJfbmF2X19ldmdyNVwiLFxuXHRcIm5hdkxpc3RcIjogXCJIZWFkZXJfbmF2TGlzdF9fWGkyZ2ZcIixcblx0XCJuYXZMaW5rXCI6IFwiSGVhZGVyX25hdkxpbmtfX2J6YndpXCIsXG5cdFwiYWN0aXZlXCI6IFwiSGVhZGVyX2FjdGl2ZV9fM0lVanRcIixcblx0XCJzaWduT3V0QnRuXCI6IFwiSGVhZGVyX3NpZ25PdXRCdG5fX3VPdEdwXCIsXG5cdFwibWVudVRvZ2dsZVwiOiBcIkhlYWRlcl9tZW51VG9nZ2xlX18wTVBnZFwiLFxuXHRcIm5hdk9wZW5cIjogXCJIZWFkZXJfbmF2T3Blbl9fUHJzaHlcIlxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./styles/Header.module.css\n");

/***/ }),

/***/ "./components/Header.js":
/*!******************************!*\
  !*** ./components/Header.js ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Header)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"@fortawesome/react-fontawesome\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ \"@fortawesome/free-solid-svg-icons\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/Header.module.css */ \"./styles/Header.module.css\");\n/* harmony import */ var _styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__]);\n_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\nfunction Header({ isLoggedIn, setIsLoggedIn }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();\n    const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);\n    const handleSignOut = ()=>{\n        localStorage.removeItem(\"isLoggedIn\");\n        setIsLoggedIn(false);\n        router.push(\"/login\");\n    };\n    const toggleMenu = ()=>{\n        setIsMenuOpen(!isMenuOpen);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().header),\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"container\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().headerContent),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                        href: \"/\",\n                        className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().logo),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                            children: \"سُبُل\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                            lineNumber: 27,\n                            columnNumber: 13\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                        lineNumber: 26,\n                        columnNumber: 11\n                    }, this),\n                    isLoggedIn && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().menuToggle),\n                                onClick: toggleMenu,\n                                \"aria-label\": \"Toggle menu\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__.FontAwesomeIcon, {\n                                    icon: isMenuOpen ? _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__.faTimes : _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__.faBars\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                    lineNumber: 32,\n                                    columnNumber: 17\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                lineNumber: 31,\n                                columnNumber: 15\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                                className: `${(_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().nav)} ${isMenuOpen ? (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().navOpen) : \"\"}`,\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                    className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().navList),\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/\",\n                                                className: `${(_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().navLink)} ${router.pathname === \"/\" ? (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().active) : \"\"}`,\n                                                onClick: ()=>setIsMenuOpen(false),\n                                                children: \"الرئيسية\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                                lineNumber: 37,\n                                                columnNumber: 21\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                            lineNumber: 36,\n                                            columnNumber: 19\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                                href: \"/profile\",\n                                                className: `${(_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().navLink)} ${router.pathname === \"/profile\" ? (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().active) : \"\"}`,\n                                                onClick: ()=>setIsMenuOpen(false),\n                                                children: \"الملف الشخصي\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                                lineNumber: 46,\n                                                columnNumber: 21\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                            lineNumber: 45,\n                                            columnNumber: 19\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                                onClick: handleSignOut,\n                                                className: (_styles_Header_module_css__WEBPACK_IMPORTED_MODULE_6___default().signOutBtn),\n                                                children: \"تسجيل الخروج\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                                lineNumber: 55,\n                                                columnNumber: 21\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                            lineNumber: 54,\n                                            columnNumber: 19\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                    lineNumber: 35,\n                                    columnNumber: 17\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                                lineNumber: 34,\n                                columnNumber: 15\n                            }, this)\n                        ]\n                    }, void 0, true)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n                lineNumber: 25,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n            lineNumber: 24,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\components\\\\Header.js\",\n        lineNumber: 23,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0hlYWRlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBd0M7QUFDWDtBQUNvQztBQUNHO0FBQ25DO0FBQ2dCO0FBRWxDLFNBQVNPLE9BQU8sRUFBRUMsVUFBVSxFQUFFQyxhQUFhLEVBQUU7SUFDMUQsTUFBTUMsU0FBU1Ysc0RBQVNBO0lBQ3hCLE1BQU0sQ0FBQ1csWUFBWUMsY0FBYyxHQUFHUCwrQ0FBUUEsQ0FBQztJQUU3QyxNQUFNUSxnQkFBZ0I7UUFDcEJDLGFBQWFDLFVBQVUsQ0FBQztRQUN4Qk4sY0FBYztRQUNkQyxPQUFPTSxJQUFJLENBQUM7SUFDZDtJQUVBLE1BQU1DLGFBQWE7UUFDakJMLGNBQWMsQ0FBQ0Q7SUFDakI7SUFFQSxxQkFDRSw4REFBQ087UUFBT0MsV0FBV2IseUVBQWE7a0JBQzlCLDRFQUFDYztZQUFJRCxXQUFVO3NCQUNiLDRFQUFDQztnQkFBSUQsV0FBV2IsZ0ZBQW9COztrQ0FDbEMsOERBQUNMLGtEQUFJQTt3QkFBQ3FCLE1BQUs7d0JBQUlILFdBQVdiLHVFQUFXO2tDQUNuQyw0RUFBQ2tCO3NDQUFLOzs7Ozs7Ozs7OztvQkFFUGhCLDRCQUNDOzswQ0FDRSw4REFBQ2lCO2dDQUFPTixXQUFXYiw2RUFBaUI7Z0NBQUVxQixTQUFTVjtnQ0FBWVcsY0FBVzswQ0FDcEUsNEVBQUMxQiwyRUFBZUE7b0NBQUMyQixNQUFNbEIsYUFBYVAsc0VBQU9BLEdBQUdELHFFQUFNQTs7Ozs7Ozs7Ozs7MENBRXRELDhEQUFDMkI7Z0NBQUlYLFdBQVcsQ0FBQyxFQUFFYixzRUFBVSxDQUFDLENBQUMsRUFBRUssYUFBYUwsMEVBQWMsR0FBRyxHQUFHLENBQUM7MENBQ2pFLDRFQUFDMEI7b0NBQUdiLFdBQVdiLDBFQUFjOztzREFDM0IsOERBQUM0QjtzREFDQyw0RUFBQ2pDLGtEQUFJQTtnREFDSHFCLE1BQUs7Z0RBQ0xILFdBQVcsQ0FBQyxFQUFFYiwwRUFBYyxDQUFDLENBQUMsRUFBRUksT0FBTzBCLFFBQVEsS0FBSyxNQUFNOUIseUVBQWEsR0FBRyxHQUFHLENBQUM7Z0RBQzlFcUIsU0FBUyxJQUFNZixjQUFjOzBEQUM5Qjs7Ozs7Ozs7Ozs7c0RBSUgsOERBQUNzQjtzREFDQyw0RUFBQ2pDLGtEQUFJQTtnREFDSHFCLE1BQUs7Z0RBQ0xILFdBQVcsQ0FBQyxFQUFFYiwwRUFBYyxDQUFDLENBQUMsRUFBRUksT0FBTzBCLFFBQVEsS0FBSyxhQUFhOUIseUVBQWEsR0FBRyxHQUFHLENBQUM7Z0RBQ3JGcUIsU0FBUyxJQUFNZixjQUFjOzBEQUM5Qjs7Ozs7Ozs7Ozs7c0RBSUgsOERBQUNzQjtzREFDQyw0RUFBQ1Q7Z0RBQU9FLFNBQVNkO2dEQUFlTSxXQUFXYiw2RUFBaUI7MERBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZbEYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdWJvbC1sZWFybmluZy1wbGF0Zm9ybS8uL2NvbXBvbmVudHMvSGVhZGVyLmpzPzRkYmIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xyXG5pbXBvcnQgeyBGb250QXdlc29tZUljb24gfSBmcm9tICdAZm9ydGF3ZXNvbWUvcmVhY3QtZm9udGF3ZXNvbWUnO1xyXG5pbXBvcnQgeyBmYUJhcnMsIGZhVGltZXMgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnMnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvSGVhZGVyLm1vZHVsZS5jc3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGVhZGVyKHsgaXNMb2dnZWRJbiwgc2V0SXNMb2dnZWRJbiB9KSB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcbiAgY29uc3QgW2lzTWVudU9wZW4sIHNldElzTWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBoYW5kbGVTaWduT3V0ID0gKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2lzTG9nZ2VkSW4nKTtcclxuICAgIHNldElzTG9nZ2VkSW4oZmFsc2UpO1xyXG4gICAgcm91dGVyLnB1c2goJy9sb2dpbicpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHRvZ2dsZU1lbnUgPSAoKSA9PiB7XHJcbiAgICBzZXRJc01lbnVPcGVuKCFpc01lbnVPcGVuKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGhlYWRlciBjbGFzc05hbWU9e3N0eWxlcy5oZWFkZXJ9PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaGVhZGVyQ29udGVudH0+XHJcbiAgICAgICAgICA8TGluayBocmVmPVwiL1wiIGNsYXNzTmFtZT17c3R5bGVzLmxvZ299PlxyXG4gICAgICAgICAgICA8c3Bhbj7Ys9mP2KjZj9mEPC9zcGFuPlxyXG4gICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAge2lzTG9nZ2VkSW4gJiYgKFxyXG4gICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtzdHlsZXMubWVudVRvZ2dsZX0gb25DbGljaz17dG9nZ2xlTWVudX0gYXJpYS1sYWJlbD1cIlRvZ2dsZSBtZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8Rm9udEF3ZXNvbWVJY29uIGljb249e2lzTWVudU9wZW4gPyBmYVRpbWVzIDogZmFCYXJzfSAvPlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPXtgJHtzdHlsZXMubmF2fSAke2lzTWVudU9wZW4gPyBzdHlsZXMubmF2T3BlbiA6ICcnfWB9PlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT17c3R5bGVzLm5hdkxpc3R9PlxyXG4gICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmtcclxuICAgICAgICAgICAgICAgICAgICAgIGhyZWY9XCIvXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7c3R5bGVzLm5hdkxpbmt9ICR7cm91dGVyLnBhdGhuYW1lID09PSAnLycgPyBzdHlsZXMuYWN0aXZlIDogJyd9YH1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTWVudU9wZW4oZmFsc2UpfVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgINin2YTYsdim2YrYs9mK2KlcclxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICA8TGlua1xyXG4gICAgICAgICAgICAgICAgICAgICAgaHJlZj1cIi9wcm9maWxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7c3R5bGVzLm5hdkxpbmt9ICR7cm91dGVyLnBhdGhuYW1lID09PSAnL3Byb2ZpbGUnID8gc3R5bGVzLmFjdGl2ZSA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICDYp9mE2YXZhNmBINin2YTYtNiu2LXZilxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlU2lnbk91dH0gY2xhc3NOYW1lPXtzdHlsZXMuc2lnbk91dEJ0bn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICDYqtiz2KzZitmEINin2YTYrtix2YjYrFxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICA8L25hdj5cclxuICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvaGVhZGVyPlxyXG4gICk7XHJcbn0iXSwibmFtZXMiOlsidXNlUm91dGVyIiwiTGluayIsIkZvbnRBd2Vzb21lSWNvbiIsImZhQmFycyIsImZhVGltZXMiLCJ1c2VTdGF0ZSIsInN0eWxlcyIsIkhlYWRlciIsImlzTG9nZ2VkSW4iLCJzZXRJc0xvZ2dlZEluIiwicm91dGVyIiwiaXNNZW51T3BlbiIsInNldElzTWVudU9wZW4iLCJoYW5kbGVTaWduT3V0IiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInB1c2giLCJ0b2dnbGVNZW51IiwiaGVhZGVyIiwiY2xhc3NOYW1lIiwiZGl2IiwiaGVhZGVyQ29udGVudCIsImhyZWYiLCJsb2dvIiwic3BhbiIsImJ1dHRvbiIsIm1lbnVUb2dnbGUiLCJvbkNsaWNrIiwiYXJpYS1sYWJlbCIsImljb24iLCJuYXYiLCJuYXZPcGVuIiwidWwiLCJuYXZMaXN0IiwibGkiLCJuYXZMaW5rIiwicGF0aG5hbWUiLCJhY3RpdmUiLCJzaWduT3V0QnRuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/Header.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Header */ \"./components/Header.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_4__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_Header__WEBPACK_IMPORTED_MODULE_3__]);\n_components_Header__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [isLoggedIn, setIsLoggedIn] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const loggedIn = localStorage.getItem(\"isLoggedIn\") === \"true\";\n        setIsLoggedIn(loggedIn);\n        if (!loggedIn && router.pathname !== \"/login\") {\n            router.push(\"/login\");\n        } else if (loggedIn && router.pathname === \"/login\") {\n            router.push(\"/\");\n        }\n    }, [\n        router.pathname\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Header__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                isLoggedIn: isLoggedIn,\n                setIsLoggedIn: setIsLoggedIn\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\pages\\\\_app.js\",\n                lineNumber: 22,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps,\n                isLoggedIn: isLoggedIn,\n                setIsLoggedIn: setIsLoggedIn\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\MSI\\\\Videos\\\\Projects\\\\Flask-Subul\\\\frontend\\\\pages\\\\_app.js\",\n                lineNumber: 23,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTRDO0FBQ0o7QUFDRTtBQUNYO0FBRWhCLFNBQVNJLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDcEQsTUFBTSxDQUFDQyxZQUFZQyxjQUFjLEdBQUdSLCtDQUFRQSxDQUFDO0lBQzdDLE1BQU1TLFNBQVNQLHNEQUFTQTtJQUV4QkQsZ0RBQVNBLENBQUM7UUFDUixNQUFNUyxXQUFXQyxhQUFhQyxPQUFPLENBQUMsa0JBQWtCO1FBQ3hESixjQUFjRTtRQUNkLElBQUksQ0FBQ0EsWUFBWUQsT0FBT0ksUUFBUSxLQUFLLFVBQVU7WUFDN0NKLE9BQU9LLElBQUksQ0FBQztRQUNkLE9BQU8sSUFBSUosWUFBWUQsT0FBT0ksUUFBUSxLQUFLLFVBQVU7WUFDbkRKLE9BQU9LLElBQUksQ0FBQztRQUNkO0lBQ0YsR0FBRztRQUFDTCxPQUFPSSxRQUFRO0tBQUM7SUFFcEIscUJBQ0U7OzBCQUNFLDhEQUFDViwwREFBTUE7Z0JBQUNJLFlBQVlBO2dCQUFZQyxlQUFlQTs7Ozs7OzBCQUMvQyw4REFBQ0g7Z0JBQVcsR0FBR0MsU0FBUztnQkFBRUMsWUFBWUE7Z0JBQVlDLGVBQWVBOzs7Ozs7OztBQUd2RSIsInNvdXJjZXMiOlsid2VicGFjazovL3N1Ym9sLWxlYXJuaW5nLXBsYXRmb3JtLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi9jb21wb25lbnRzL0hlYWRlcic7XHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG4gIGNvbnN0IFtpc0xvZ2dlZEluLCBzZXRJc0xvZ2dlZEluXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IGxvZ2dlZEluID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lzTG9nZ2VkSW4nKSA9PT0gJ3RydWUnO1xyXG4gICAgc2V0SXNMb2dnZWRJbihsb2dnZWRJbik7XHJcbiAgICBpZiAoIWxvZ2dlZEluICYmIHJvdXRlci5wYXRobmFtZSAhPT0gJy9sb2dpbicpIHtcclxuICAgICAgcm91dGVyLnB1c2goJy9sb2dpbicpO1xyXG4gICAgfSBlbHNlIGlmIChsb2dnZWRJbiAmJiByb3V0ZXIucGF0aG5hbWUgPT09ICcvbG9naW4nKSB7XHJcbiAgICAgIHJvdXRlci5wdXNoKCcvJyk7XHJcbiAgICB9XHJcbiAgfSwgW3JvdXRlci5wYXRobmFtZV0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPEhlYWRlciBpc0xvZ2dlZEluPXtpc0xvZ2dlZElufSBzZXRJc0xvZ2dlZEluPXtzZXRJc0xvZ2dlZElufSAvPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IGlzTG9nZ2VkSW49e2lzTG9nZ2VkSW59IHNldElzTG9nZ2VkSW49e3NldElzTG9nZ2VkSW59IC8+XHJcbiAgICA8Lz5cclxuICApO1xyXG59Il0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiSGVhZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJpc0xvZ2dlZEluIiwic2V0SXNMb2dnZWRJbiIsInJvdXRlciIsImxvZ2dlZEluIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInBhdGhuYW1lIiwicHVzaCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@fortawesome/react-fontawesome":
/*!*************************************************!*\
  !*** external "@fortawesome/react-fontawesome" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@fortawesome/react-fontawesome");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "@fortawesome/free-solid-svg-icons":
/*!****************************************************!*\
  !*** external "@fortawesome/free-solid-svg-icons" ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@fortawesome/free-solid-svg-icons");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();