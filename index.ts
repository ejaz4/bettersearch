import fastify from "fastify";
import { config } from "dotenv";
import { setRoutes } from "./routes";
import { ddgSearch } from "./search/providers/duckduckgo";

config()
export const server = fastify();
const port = process.env.PORT || 3000;

setRoutes();

server.listen(port, (err, address) =>{
    console.log(`Listening on ${address}`);
})