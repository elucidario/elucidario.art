import { useContext } from "react";

import { Context } from "./defaultContext";

export const useSystemProvider = () => useContext(Context);
