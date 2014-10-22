mvsociales
==========

Libreria que centraliza las conexion a las API de Twitter y Facebook


TODO
----

- Guía de instalación
	

Métodos
-------

### mv.facebook.login

Autentica con Facebook Connect.

	mv.facebook.login([scope], [fnCallback], [fbCallbackPreloader])

###### scope

- Permisos a solicitar en la ventana de facebook
- Type: string
- Default: email

###### fnCallback: 

	fnCallback(status, user)
	
- Callback a ejecutar luego del proceso de validación
- Type: function
- Return
  - status: boolean
  - user: object, datos del usuario autenticado
	
###### fbCallbackPreloader (deprecated)

- Se ejecuta antes de levantar la ventana de validación, útil para mostrar preloaders.
- Type: function


### mv.facebook.logout

Cierra sesión en Facebook.

	mv.facebook.logout([fnCallback])

###### fnCallback

	fnCallback(status, data)

- Callback a ejecutar luego del proceso de logout.
- Type: function
- Return
  - status: boolean
  - data: object, respuesta de FB, incluye el ID de usuario.
 
### mv.facebook.publicar

Publica en el muro del usuario (/me/feed).

	mv.facebook.publicar(params, [fnCallback])
	
###### params

- Parametros de publicacion en el muro del usuario.
- Type: object

###### fnCallback

	fnCallback(status, response)

- Type: function
- Return: 
  - status: boolean
  - response: object, respuesta desde FB, incluye el ID de la publicación.

### mv.facebook.compartir

Comparte en el stream publico.

	mv.facebook.publicar(params, [fnCallback])
	
###### params

- Parametros de publicacion.
- Type: object

###### fnCallback

	fnCallback(response)

- Type: function
- Return: 
  - response: object

### mv.facebook.compartirOg

Levanta un popup utilizando el sharer nativo de facebook.

	mv.facebook.compartirOg(url)
	
###### params

- URL del sitio que se quiere compartir.

### mv.facebook.invitarAmigos

Levanta el modal para seleccionar varios amigos.

	mv.facebook.invitarAmigos(msg, [ids], [fnCallback])

###### msg

- Mensaje a mostrar en el modal.
- Type: string

###### ids (opcional)

- IDs de amigos pre-seleccionados.
- Type: array

###### fnCallback

	fnCallback(data)

- Respuesta de FB.
- Type: function
- Return
  - data: object
