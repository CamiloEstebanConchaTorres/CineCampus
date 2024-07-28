{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'usuario_id',
      'numero_unico',
      'fecha_emision',
      'fecha_expiracion',
      'estado',
      'nivel_vip'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'ID único del documento'
      },
      usuario_id: {
        bsonType: 'objectId',
        description: 'ID del usuario asociado al ticket'
      },
      numero_unico: {
        bsonType: 'string',
        description: 'Número único del ticket'
      },
      fecha_emision: {
        bsonType: 'date',
        description: 'Fecha de emisión del ticket'
      },
      fecha_expiracion: {
        bsonType: 'date',
        description: 'Fecha de expiración del ticket'
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'activa',
          'inactiva'
        ],
        description: 'Estado del ticket'
      },
      nivel_vip: {
        bsonType: 'string',
        'enum': [
          'oro',
          'plata',
          'bronce'
        ],
        description: 'Nivel VIP del ticket'
      }
    }
  }
}