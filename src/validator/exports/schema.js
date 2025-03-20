const Joi = require('joi');

const ExportNotesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: { allow: false } }).required(),
});

module.exports = ExportNotesPayloadSchema;