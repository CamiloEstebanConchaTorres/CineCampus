{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'pelicula_id',
      'sala_id',
      'fechaHora',
      'precio',
      'estado'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'ID único del documento'
      },
      pelicula_id: {
        bsonType: 'objectId',
        description: 'ID de la película'
      },
      sala_id: {
        bsonType: 'objectId',
        description: 'ID de la sala'
      },
      fechaHora: {
        bsonType: 'date',
        description: 'Fecha y hora de la proyección en formato ISO 8601'
      },
      precio: {
        bsonType: 'double',
        description: 'Precio de la entrada'
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'programada',
          'cancelada',
          'completada'
        ],
        description: 'Estado de la proyección'
      }
    }
  }
}