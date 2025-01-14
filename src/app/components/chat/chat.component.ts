import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  SecurityContext,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import highlightJs from 'highlight.js';
import CopyButtonPlugin from 'highlightjs-copy-ts';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';
import { EnterSubmitDirective } from '../../directives/enter-submit.directive';
import { ModelLabels, ModelType } from '../../enums/model-type';
import { TypeRole } from '../../enums/type-role';
import { ChatMessage } from '../../models/chat-message';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EnterSubmitDirective,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('scrollContainer') private scrollContainer: ElementRef | undefined;
  chatForm!: FormGroup;
  messages = signal<ChatMessage[]>([]);
  models = Object.values(ModelType);
  modelLabels = ModelLabels;

  private messageSubject = new Subject<string>();
  private newMessageAdded = false;

  ngOnInit(): void {
    highlightJs.addPlugin(new CopyButtonPlugin());

    this.chatForm = this.fb.group({
      userInput: ['', Validators.required],
      selectedModel: [ModelType.CLAUDE],
    });

    this.chatForm.get('selectedModel')?.valueChanges.subscribe((model) => {
      this.chatService.setModel(model);
      this.messages.set([]);
    });

    this.messageSubject
      .pipe(
        switchMap((message) =>
          this.chatService.sendMessage(message).pipe(
            catchError((error) => {
              console.error('Error:', error);
              this.addMessage(
                TypeRole.ASSISTANT,
                "Désolé, une erreur s'est produite."
              );
              return EMPTY;
            })
          )
        )
      )
      .subscribe((response) => {
        const formattedResponse = this.formatMessage(response);
        this.messages.update((msgs) => [
          ...msgs,
          { role: TypeRole.ASSISTANT, content: formattedResponse },
        ]);
        this.newMessageAdded = true;
      });
  }

  ngAfterViewChecked(): void {
    if (this.newMessageAdded) {
      this.scrollToBottom();
      highlightJs.highlightAll();
      this.newMessageAdded = false;
    }
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const userInput = this.chatForm.get('userInput')?.value;
      const selectedModel = this.chatForm.get('selectedModel')?.value;
      const formattedInput = this.formatMessage(userInput);
      this.messages.update((msgs) => [
        ...msgs,
        { role: TypeRole.USER, content: formattedInput },
      ]);
      this.newMessageAdded = true;
      setTimeout(() => this.scrollToBottom(), 0);
      this.messageSubject.next(userInput);
      this.chatForm.patchValue({ userInput: '' });
    }
  }

  private addMessage(role: TypeRole, content: string): void {
    if (!content) return;

    const formattedContent = this.formatMessage(content);
    this.messages.update((msgs) => [
      ...msgs,
      { role, content: formattedContent },
    ]);
    this.newMessageAdded = true;
  }

  private formatMessage(message: string): SafeHtml {
    const formatted = message.replace(
      /```(\w*)\s*([\s\S]*?)```/g,
      (match, language, code) => {
        const cleanedCode = this.escapeHtml(
          code
            .trim()
            .replace(/^\s*\n|\n\s*$/g, '')
            .replace(/^/gm, '    ')
        );

        return (
          this.sanitizer.sanitize(
            SecurityContext.HTML,
            `<pre><code class = "${language}" >${cleanedCode}</code></pre >`
          ) ?? ''
        );
      }
    );

    const finalFormatted = formatted.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(finalFormatted);
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
