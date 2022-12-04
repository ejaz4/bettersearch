import { server } from '../';
import { FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from "fs";
import { search } from '../search';

type SearchRequest = FastifyRequest<{
    Querystring: {
        q: string;
    }
}>


export const staticRoutes = () => {
    const searchFile = fs.readFileSync("./routes/static/search.html").toString();
    const indexFile = fs.readFileSync("./routes/static/index.html").toString();

    server.register(fastifyStatic, {
        root: path.join(__dirname, 'static/css'),
        prefix: '/css',
        decorateReply: true
    })

    server.get("/search", async(request: SearchRequest, reply) => {
        var searchReply = searchFile.replaceAll("<query>", request.query.q);
        var results = await search(request.query.q, "web");
        var resultsElem = "";

        for (const item of results) {
            resultsElem += `<div class="result"><a href="${item.link.href}"><h3>${item.title}</h3></a><p>${item.description}</p></div>`
        }

        searchReply = searchReply.replaceAll("<results>", resultsElem);

        reply.type("text/html").send(searchReply);
    });

    server.get("/", (request, reply) => {
        reply.type("text/html").send(indexFile);
    });
}