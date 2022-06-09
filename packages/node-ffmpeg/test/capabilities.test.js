var { Ffmpeg } = require('..'),
  path = require('path'),
  assert = require('assert');

// delimiter fallback for node 0.8
var PATH_DELIMITER = path.delimiter || (require('os').platform().match(/win(32|64)/) ? ';' : ':');

describe('Capabilities', function() {
  describe('ffmpeg capabilities', function() {
    it('should enable querying for available codecs', async function() {
      const codecs = await new Ffmpeg({ source: '' }).availableCodecs();
      (typeof codecs).should.equal('object');
      Object.keys(codecs).length.should.not.equal(0);

      ('pcm_s16le' in codecs).should.equal(true);
      ('type' in codecs.pcm_s16le).should.equal(true);
      (typeof codecs.pcm_s16le.type).should.equal('string');
      ('description' in codecs.pcm_s16le).should.equal(true);
      (typeof codecs.pcm_s16le.description).should.equal('string');
      ('canEncode' in codecs.pcm_s16le).should.equal(true);
      (typeof codecs.pcm_s16le.canEncode).should.equal('boolean');
      ('canDecode' in codecs.pcm_s16le).should.equal(true);
      (typeof codecs.pcm_s16le.canDecode).should.equal('boolean');
    });

    it('should enable querying for available encoders', async function() {
      const encoders = await new Ffmpeg().availableEncoders();

      (typeof encoders).should.equal('object');
      Object.keys(encoders).length.should.not.equal(0);

      ('pcm_s16le' in encoders).should.equal(true);
      ('type' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.type).should.equal('string');
      ('description' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.description).should.equal('string');
      ('experimental' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.experimental).should.equal('boolean');
    });

    it('should enable querying for available filters', async function() {
      const filters = await new Ffmpeg({ source: '' }).availableFilters();
      (typeof filters).should.equal('object');
      Object.keys(filters).length.should.not.equal(0);

      ('anull' in filters).should.equal(true);
      ('description' in filters.anull).should.equal(true);
      (typeof filters.anull.description).should.equal('string');
      ('input' in filters.anull).should.equal(true);
      (typeof filters.anull.input).should.equal('string');
      ('output' in filters.anull).should.equal(true);
      (typeof filters.anull.output).should.equal('string');
      ('multipleInputs' in filters.anull).should.equal(true);
      (typeof filters.anull.multipleInputs).should.equal('boolean');
      ('multipleOutputs' in filters.anull).should.equal(true);
      (typeof filters.anull.multipleOutputs).should.equal('boolean');
    });

    it('should enable querying for available formats', async function() {
      const ffmpeg = new Ffmpeg({ source: '' });
      const formats = await ffmpeg.availableFormats();
      (typeof formats).should.equal('object');
      Object.keys(formats).length.should.not.equal(0);

      ('wav' in formats).should.equal(true);
      ('description' in formats.wav).should.equal(true);
      (typeof formats.wav.description).should.equal('string');
      ('canMux' in formats.wav).should.equal(true);
      (typeof formats.wav.canMux).should.equal('boolean');
      ('canDemux' in formats.wav).should.equal(true);
      (typeof formats.wav.canDemux).should.equal('boolean');
    });
  });
});
