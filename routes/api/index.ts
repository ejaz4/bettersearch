import { server } from '../../';
import { FastifyRequest } from 'fastify';
import { search } from '../../search';

type SearchRequest = FastifyRequest<{
    Body: {
        q: string;
        type: string;
    }
}>

export const apiRoutes = () => {
    server.post('/api/search', async(request: SearchRequest, reply) => {
        const query = request.body.q;
        const type = request.body.type;

        const results = await search(query, type);
        reply.send(results);
    });
}