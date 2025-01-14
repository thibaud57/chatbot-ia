import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ModelMaxTokens, ModelType } from '../enums/model-type';
import { TypeRole } from '../enums/type-role';
import { ChatMessage } from '../models/chat-message';

interface ApiResponse {
  response: string;
  history: ChatMessage[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private messageHistory: ChatMessage[] = [];
  private currentModel: ModelType = ModelType.CLAUDE;

  constructor(private http: HttpClient) {}

  setModel(model: ModelType): void {
    this.currentModel = model;
  }

  sendMessage(
    message: string,
    temperature: number = 0.1,
    maxTokens?: number
  ): Observable<string> {
    const effectiveMaxTokens = maxTokens || ModelMaxTokens[this.currentModel];

    return this.http
      .post<ApiResponse>(this.apiUrl, {
        message,
        messageHistory: this.messageHistory.map((msg) => ({
          role: msg.role === TypeRole.USER ? 'user' : 'assistant',
          content: msg.content.toString(),
        })),
        temperature,
        maxTokens: effectiveMaxTokens,
        model: this.currentModel,
      })
      .pipe(
        map((response) => {
          if (!response || !response.response) {
            throw new Error('Format de réponse invalide');
          }

          this.messageHistory = response.history || [];
          return response.response;
        }),
        catchError((error) => {
          console.error('Error in sendMessage:', error);
          if (error instanceof Error) {
            return throwError(() => error);
          }
          return throwError(
            () =>
              new Error(
                'Une erreur est survenue lors de la communication avec le serveur.'
              )
          );
        })
      );
  }
}
