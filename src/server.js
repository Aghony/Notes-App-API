const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/clienterror');

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  server.ext('onPreResponse', (request, h) =>{
    // mendapatkan konteks response dari request
    const { response } = request;

    //penanganan client error secara internal
    if (response instanceof ClientError){
      const newReponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newReponse.code(response.statusCode);
      return newReponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();