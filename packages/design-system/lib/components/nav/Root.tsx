import { cn } from "@/utils";
import { NavProps } from "@elucidario/types-design-system";
import { Provider } from "./Provider";

export function Root({ children, className, ...props }: NavProps) {
    return (
        <Provider {...props}>
            <nav className={cn(className)}>{children}</nav>
        </Provider>
    );
}

/*
<ul id="exTest" className="disclosure-nav">
    <li>
        <button
            type="button"
            aria-expanded="true"
            aria-controls="id_about_menu"
        >
            About
        </button>
        <ul id="id_about_menu">
            <li>
                <a href="#mythical-page-content">Overview</a>
            </li>
            <li>
                <a href="#mythical-page-content">Administration</a>
            </li>
            <li>
                <a href="#mythical-page-content">Facts</a>
            </li>
            <li>
                <a href="#mythical-page-content">Campus Tours</a>
            </li>
        </ul>
    </li>
    <li>
        <button
            type="button"
            aria-expanded="true"
            aria-controls="id_admissions_menu"
        >
            Admissions
        </button>
        <ul id="id_admissions_menu">
            <li>
                <a href="#mythical-page-content">Apply</a>
            </li>
            <li>
                <a href="#mythical-page-content">Tuition</a>
            </li>
            <li>
                <a href="#mythical-page-content">Sign Up</a>
            </li>
            <li>
                <a href="#mythical-page-content">Visit</a>
            </li>
            <li>
                <a href="#mythical-page-content">Photo Tour</a>
            </li>
            <li>
                <a href="#mythical-page-content">Connect</a>
            </li>
        </ul>
    </li>
    <li>
        <button
            type="button"
            aria-expanded="true"
            aria-controls="id_academics_menu"
        >
            Academics
        </button>
        <ul id="id_academics_menu">
            <li>
                <a href="#mythical-page-content">
                    Colleges & Schools
                </a>
            </li>
            <li>
                <a href="#mythical-page-content">
                    Programs of Study
                </a>
            </li>
            <li>
                <a href="#mythical-page-content">Honors Programs</a>
            </li>
            <li>
                <a href="#mythical-page-content">Online Courses</a>
            </li>
            <li>
                <a href="#mythical-page-content">Course Explorer</a>
            </li>
            <li>
                <a href="#mythical-page-content">
                    Register for ClassName
                </a>
            </li>
            <li>
                <a href="#mythical-page-content">
                    Academic Calendar
                </a>
            </li>
            <li>
                <a href="#mythical-page-content">Transcripts</a>
            </li>
        </ul>
    </li>
</ul>
*/
