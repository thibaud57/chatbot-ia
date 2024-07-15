import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {TypeResponse} from "../enums/type-response";
import {ChatResponse} from "../models/chat-response";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'https://us-central1-claude-chatbot.cloudfunctions.net/api/chat';

    constructor(private http: HttpClient) {
    }

    sendMessage(message: string): Observable<string> {
        return this.http.post<ChatResponse>(this.apiUrl, { message }).pipe(
            map(response => {
                if (response['type'] === TypeResponse.ERROR){
                    throw new Error(response.text);
                }
                return response.text;
            }),
            catchError(error => {
                if (error instanceof Error) {
                    return throwError(() => error);
                }
                return throwError(() => new Error('Une erreur est survenue lors de la communication avec le serveur.'));
            })
        );
    }
}
