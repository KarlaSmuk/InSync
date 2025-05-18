export default {
    insync: {
        input: 'http://localhost:8000/openapi.json',
        output: {
            mode: 'tags-split',
            target: './src/api/',
            client: 'axios',
        },
    },
};
