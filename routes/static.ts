import { server } from '../';
import { FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from "fs";
import { search } from '../search';

type SearchRequest = FastifyRequest<{
    Querystring: {
        q: string;
        format?: string;
    }
}>


export const staticRoutes = () => {
    const searchFile = fs.readFileSync("./routes/static/search.html").toString();
    const indexFile = fs.readFileSync("./routes/static/index.html").toString();

    server.register(fastifyStatic, {
        root: path.join(__dirname, 'static'),
        prefix: '/',
    })

    server.get("/search", async(request: SearchRequest, reply) => {
        var searchReply = searchFile.replaceAll("<query>", request.query.q);
        var results = await search(request.query.q, "web");
        var resultsElem = "";
        var format = request.query.format ? request.query.format : "html";

        if (format == "html") {
            for (const item of results) {
                resultsElem += `<div class="result"><a href="${item.link.href}"><h3 class="result-title">${item.title}</h3></a><p class="result-link">${item.link.href}</p><p class="result-description">${item.description}</p></div>`
            }

            searchReply = searchReply.replaceAll("<results>", resultsElem);

            reply.type("text/html").send(searchReply);
        }

        if (format == "json") {
            reply.type("application/json").send(results);
        }
    });

    server.get("/", (request, reply) => {
        reply.type("text/html").send(indexFile);
    });
}