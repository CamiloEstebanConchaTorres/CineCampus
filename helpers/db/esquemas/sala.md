{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'numero',
      'capacidad',
      'tipo'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'ID único del documento'
      },
      numero: {
        bsonType: 'int',
        description: 'Número identificador de la sala'
      },
      capacidad: {
        bsonType: 'int',
        description: 'Capacidad de la sala'
      },
      tipo: {
        bsonType: 'string',
        'enum': [
          '2D',
          '3D',
          'IMAX'
        ],
        description: 'Tipo de la sala'
      }
    }
  }
}