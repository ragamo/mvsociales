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

	mv.facebook.login(_string_ scope, _function_ fnCallback, _function_ fbCallbackPreloader)

- __scope__: permisos a solicitar (default: email)
- __fnCallback__: callback a realizar luego del proceso de validación

	fnCallback(status, user)
	
- __fbCallbackPreloader__: se ejecuta antes de levantar la ventana de validación, útil para mostrar preloaders.
