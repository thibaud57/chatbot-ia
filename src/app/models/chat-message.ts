import {TypeRole} from "../enums/type-role";
import {SafeHtml} from "@angular/platform-browser";

export interface ChatMessage {
    role: TypeRole
    content: string | SafeHtml
}
