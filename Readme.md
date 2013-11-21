mvsociales
==========

Libreria que centraliza las conexion a las API de Twitter y Facebook

No probado aún en producción.


TODO
----

- Documentación de métodos
- Guía de instalación
	

Métodos
-------

### mv.facebook.login

	mv.facebook.login(scope, fnCallback, fbCallbackPreloader)

###### scope

- Permisos a solicitar en la ventana de facebook
- Type: string
- Default: email

###### fnCallback: 

	fnCallback(status, user)
	
- Callback a ejecutar luego del proceso de validación
- Type: function
	
###### fbCallbackPreloader

- Se ejecuta antes de levantar la ventana de validación, útil para mostrar preloaders.
- Type: function


### mv.facebook.logout

	mv.facebook.login(fnCallback)

###### fnCallback

- Callback a ejecutar luego del proceso de logout.
- Type: function
 

### mv.facebook.publicar

	mv.facebook.publicar(params, fnCallback)
	
###### params

- Parametros de publicacion en el muro del usuario.
- Type: object
- Default:

