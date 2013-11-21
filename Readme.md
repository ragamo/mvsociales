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

### mv.facebook.login(string scope, function fnCallback, function fbCallbackPreloader)

- scope: permisos a solicitar (default: email)
- fnCallback: callback a realizar luego del proceso de validación
	fnCallback(status, user)
- fbCallbackPreloader: se ejecuta antes de levantar la ventana de validación, útil para mostrar preloaders.
