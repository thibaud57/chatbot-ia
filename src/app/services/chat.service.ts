import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {TypeResponse} from "../enums/type-response";
import {ChatResponse} from "../models/chat-response";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    sendMessage(message: string, temperature: number = 0.2, maxTokens: number = 2048): Observable<string> {
        return this.http.post<ChatResponse>(this.apiUrl, { message, temperature, maxTokens }).pipe(
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