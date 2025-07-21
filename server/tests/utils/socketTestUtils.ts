import { createServer, Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "net";

export async function setupTestServer(
    handlers: (io: IOServer, socket: any) => void,
    clientCount = 1
): Promise<{
    io: IOServer;
    httpServer: HttpServer;
    clients: ClientSocket[];
}> {
    return new Promise(resolve => {
        const httpServer = createServer();
        const io = new IOServer(httpServer);

        io.on("connection", socket => {
            handlers(io, socket);
        });

        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;

            const clients: ClientSocket[] = [];
            let connected = 0;
            for (let i = 0; i < clientCount; i++) {
                const clientSocket = Client(`http://localhost:${port}`);
                clientSocket.on("connect", () => {
                    connected++;
                    if (connected === clientCount)
                        resolve({ io, httpServer, clients });
                });

                clients.push(clientSocket);
            }
        });
    });
}

export async function teardownTestServer(
    io: IOServer,
    httpServer: HttpServer,
    clients: ClientSocket[]
) {
    clients.forEach(async client => await client.close());
    await io.close();
    httpServer.close();
}
