export default {
    insync: {
        input: 'http://localhost:8000/openapi.json',
        output: {
            mode: 'tags-split',
            target: './src/api/',
            client: 'axios',
            override: {
                mutator: {
                    path: './src/utils/customAxios.ts',
                    name: 'customInstance',
                },
            },
        },
    },
};
