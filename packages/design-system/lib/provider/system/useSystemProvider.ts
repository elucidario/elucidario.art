import { useContext } from "react";

import { Context } from "./Context";

export const useSystemProvider = () => useContext(Context);
