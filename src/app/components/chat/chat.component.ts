import {AfterViewChecked, Component, inject, OnInit, SecurityContext, signal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {catchError, EMPTY, Subject, switchMap} from "rxjs";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ChatMessage} from "../../models/chat-message";
import {TypeRole} from "../../enums/type-role";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import hljs from 'highlight.js';

import {EnterSubmitDirective} from "../../directives/enter-submit.directive";
import CopyButtonPlugin from "highlightjs-copy-ts";

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, CommonModule, ReactiveFormsModule, EnterSubmitDirective],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
    private fb = inject(FormBuilder);
    private chatService = inject(ChatService);
    private sanitizer = inject(DomSanitizer);

    chatForm!: FormGroup;
    messages = signal<ChatMessage[]>([]);
    private messageSubject = new Subject<string>();

    ngOnInit(): void {
        hljs.addPlugin(new CopyButtonPlugin());

        this.chatForm = this.fb.group({
            userInput: ['', Validators.required]
        });

        this.messageSubject.pipe(
            switchMap(message => this.chatService.sendMessage(message).pipe(
                catchError(error => {
                    console.error('Error:', error);
                    this.addMessage(TypeRole.ASSISTANT, 'Désolé, une erreur s\'est produite.');
                    return EMPTY;
                })
            ))
        ).subscribe(response => {
            this.addMessage(TypeRole.ASSISTANT, response);
        });
    }

    ngAfterViewChecked(): void {
        hljs.highlightAll();
    }

    sendMessage(): void {
        if (this.chatForm.valid) {
            const userInput = this.chatForm.get('userInput')?.value;
            this.addMessage(TypeRole.USER, userInput);
            this.messageSubject.next(userInput);
            this.chatForm.reset();
        }
    }

    private addMessage(role: TypeRole, content: string): void {
        const formattedContent = this.formatMessage(content);
        this.messages.update(msgs => [...msgs, {role, content: formattedContent}]);
    }

    private formatMessage(message: string): SafeHtml {
        const formatted = message.replace(/```(\w*)\s*([\s\S]*?)```/g, (match, language, code) => {
            const cleanedCode = this.escapeHtml(code.trim()
                .replace(/^\s*\n|\n\s*$/g, '')
                .split('\n').map((line: string) => line.trim()).join('\n'));

            return this.sanitizer.sanitize(SecurityContext.HTML,
                `<pre><code class="${language}">${cleanedCode}</code></pre>`
            ) || '';
        });

        const finalFormatted = formatted.replace(/\n/g, '<br>');

        return this.sanitizer.bypassSecurityTrustHtml(finalFormatted);
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
