import { cn } from "@/utils";
import logo from "../../../assets/svg/type=vertical, color=pink, theme=dark.svg";

export function Logo() {
    return (
        <div className={cn()}>
            <img className={cn("max-h-14")} src={logo} alt="logo" />
        </div>
    );
}
