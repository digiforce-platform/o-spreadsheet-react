export class WebsocketTransport {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string = 'ws://localhost:9090') {
    this.url = url;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => resolve();
        this.ws.onerror = (error) => reject(error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async sendMessage(message: any): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        callback(JSON.parse(event.data));
      };
    }
  }
} 