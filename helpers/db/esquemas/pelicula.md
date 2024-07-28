{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'titulo',
      'genero',
      'duracion',
      'sinopsis',
      'clasificacion',
      'director',
      'actores',
      'fechaEstreno'
    ],
    properties: {
      titulo: {
        bsonType: 'string',
        description: 'Debe ser una cadena de texto que represente el título de la película.'
      },
      genero: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Debe ser un arreglo de cadenas de texto que representan los géneros de la película.'
      },
      duracion: {
        bsonType: 'int',
        description: 'Debe ser un número entero que representa la duración en minutos.'
      },
      sinopsis: {
        bsonType: 'string',
        description: 'Debe ser una cadena de texto que describe la sinopsis de la película.'
      },
      clasificacion: {
        bsonType: 'string',
        description: 'Debe ser una cadena de texto que representa la clasificación de la película.'
      },
      director: {
        bsonType: 'string',
        description: 'Debe ser una cadena de texto que representa el nombre del director.'
      },
      actores: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Debe ser un arreglo de cadenas de texto que representan los actores de la película.'
      },
      fechaEstreno: {
        bsonType: 'string',
        description: 'Debe ser una cadena de texto en formato \'YYYY-MM-DD\' que representa la fecha de estreno de la película.'
      }
    }
  }
}