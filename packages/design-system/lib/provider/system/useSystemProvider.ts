import { useContext } from "react";

import { SystemContext } from "./defaultContext";

export const useSystemProvider = () => useContext(SystemContext);
