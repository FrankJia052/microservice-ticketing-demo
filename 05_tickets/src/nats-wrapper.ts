import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
    private _client?: Stan;

    // access the Nats client by using the client property
    // if we call client before connect, throw error
    get client() {
        if(!this._client) {
            throw new Error("Cannot access NATS client before connecting");
        }

        return this._client;
    }

    connect(clusterId:string, clientId:string, url:string) {
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise<void>((resolve, reject) => {
            // 因为有 get 方法，可以直接用 this.client
            this.client.on("connect", () => {
                console.log("Connected to NATS")
                resolve();
            })
            this.client.on("error", (err) => {
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();