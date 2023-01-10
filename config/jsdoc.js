module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Human Rights First: Asylum Report Generator API',
      version: '1.0.0',
      description: 'API for HRF: Report Generator',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License',
      },
    },
    tags: [
      {
        name: 'Cases',
        description: 'Operations for cases',
      },
    ],
    components: {
      responses: {
        BadRequest: {
          description: 'Bad request. case already exists',
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'Not Found',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/**/*Router.js'],
};
