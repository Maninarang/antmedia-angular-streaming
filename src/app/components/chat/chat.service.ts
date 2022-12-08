import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
export class ChatService {
    private localSocketUrl = environment.mediaUrl;
    private socket;
    private localSocket;
    userName: string = 'Guest User';

    constructor() {
        this.localSocket = io(this.localSocketUrl);
        if (localStorage.getItem('userName')) {
            this.userName = localStorage.getItem('userName');
        }
    }

 //////////////////// method to send message in a chat /////////////////////////////////////

    public sendMessage(message,roomId,type,extension) {
        this.localSocket.emit('newMessage', { userId:localStorage.getItem('userId'),userName: this.userName, message: message,roomId:roomId,type:type,extension: extension });
    }

  
 //////////////////// receive message in a chat ////////////////////////////////

    public getMessages = () => {
        return Observable.create((observer) => {
            this.localSocket.on('newMessage', (message) => {
                observer.next(message);
            });
        });
    }


}