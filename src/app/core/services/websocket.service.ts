import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient!: Client;

  connect(callback: (message: any) => void) {

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS('http://localhost:8081/ws'),

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },

      onConnect: () => {
        console.log("WebSocket Connected ✅");

        //  This must match backend @SendToUser
        this.stompClient.subscribe('/topic/notifications', msg => {
          callback(JSON.parse(msg.body));
        });
      }
    });

    this.stompClient.activate();
  }
}