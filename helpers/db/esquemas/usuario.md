{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'nombre',
      'apellido',
      'email',
      'password',
      'rol',
      'fechaRegistro',
      'ultimoAcceso'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'ID único del documento'
      },
      nombre: {
        bsonType: 'string',
        description: 'Nombre del usuario'
      },
      apellido: {
        bsonType: 'string',
        description: 'Apellido del usuario'
      },
      email: {
        bsonType: 'string',
        pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
        description: 'Email del usuario, debe ser una dirección de correo válida'
      },
      password: {
        bsonType: 'string',
        description: 'Contraseña del usuario, debe estar en formato cifrado'
      },
      rol: {
        bsonType: 'string',
        'enum': [
          'estandar',
          'vip'
        ],
        description: 'Rol del usuario, debe ser \'estandar\' o \'vip\''
      },
      fechaRegistro: {
        bsonType: 'date',
        description: 'Fecha en la que el usuario se registró'
      },
      ultimoAcceso: {
        bsonType: 'date',
        description: 'Fecha del último acceso del usuario'
      }
    }
  }
}