# CineCampus

## **Developer**

- Camilo Esteban Concha Torres

## Configuracion del archivo `.env`

Crea un archivo llamado `.env` en la raíz de tu proyecto y agrega las siguientes variables de entorno:

```javascript
MONGODB_HOST=mongodb://
MONGODB_USER=camilo
MONGODB_PASS=1111
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus
```

## Instalacion de las dependencias necesarias

 Nos aseguramos de instalar el paquete `mongodb` ejecutando:

```bash
npm install mongodb
```

## Ejecucion del proyecto

Para ejecutar el proyecto, nos aseguramos de que el archivo `.env` esté configurado correctamente y luego ejecutamos el siguiente comando en la consola:

```bash
npm run dev
```