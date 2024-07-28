{
    $jsonSchema: {
      bsonType: 'object',
      required: [
        '_id',
        'sala_id',
        'fila',
        'numero_asiento',
        'tipo',
        'estado'
      ],
      properties: {
        _id: {
          bsonType: 'objectId',
          description: 'Identificador único del asiento.'
        },
        sala_id: {
          bsonType: 'objectId',
          description: 'Identificador único de la sala.'
        },
        fila: {
          bsonType: 'string',
          'enum': [
            'A',
            'B',
            'C',
            'D',
            'E'
          ],
          description: 'Letra de la fila en la sala.'
        },
        numero_asiento: {
          bsonType: 'int',
          description: 'Número del asiento dentro de la fila.'
        },
        tipo: {
          bsonType: 'string',
          'enum': [
            'regular',
            'vip',
            'discapacitados'
          ],
          description: 'Tipo de asiento.'
        },
        estado: {
          bsonType: 'string',
          'enum': [
            'disponible',
            'ocupado',
            'reservado',
            'fuera de servicio'
          ],
          description: 'Estado del asiento.'
        }
      }
    }
  }