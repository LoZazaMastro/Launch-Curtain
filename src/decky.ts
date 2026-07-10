// Adattatori verso le API/librerie fornite da @decky durante la build.
// (Nel dist compilato queste erano variabili globali: SP_REACT, SP_JSX, DFL, ecc.)
import * as SP_REACT from "react";
import * as SP_JSX from "react/jsx-runtime";
import * as DFL from "@decky/ui";
import { callable, toaster, openFilePicker, routerHook, definePlugin } from "@decky/api";

export { SP_REACT, SP_JSX, DFL, callable, toaster, openFilePicker, routerHook, definePlugin };
