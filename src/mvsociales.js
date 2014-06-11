(function(window, document, undefined) {

	// Config
	if(!window.FB_API_KEY) 
		window.FB_API_KEY = 0;

	if(!window.BASE_URL)
		window.BASE_URL = "";


	// Objeto base - Entorno privado
	var mvsociales = (function() {

		// Interfaces
		var interfaces = {

			/*-- Facebok --*/
			facebook: {
				login: function(_scope, _fnCallback) {
					mv.api.facebook.login(_scope, _fnCallback);
				},
				
				logout: function(_fnCallback) {
					mv.api.facebook.logout(_fnCallback);
				},
				
				publicar: function(_objBase, _fnCallback) {
					mv.api.facebook.publicar(_objBase, _fnCallback);
				},
				
				compartir: function(_objBase, _fnCallback) {
					mv.api.facebook.compartir(_objBase, _fnCallback);
				},
				
				invitarAmigos: function(_msg, _ids, _fnCallback) {
					mv.api.facebook.invitarAmigos(_msg, _ids, _fnCallback); 
				},
				
				compartirOg: function(_url) {
					mv.api.facebook.compartirOg(_url);
				}
			},
			
			/*-- Twitter --*/
			twitter: {
				login: function() {
					mv.api.twitter.login();	
				},
				compartir: function(_msg, _url, _via) {
					mv.api.twitter.compartir(_msg, _url, _via);
				}
			},

			/*-- Google Plus --*/
			gplus: {
				compartir: function(_url) {
					mv.api.gplus.compartir(_url);
				}
			},

			/*-- Otros --*/
			version: function() {
				return mv.version;
			}
		};	

		// Process
		var mv = {
			version: '1.4.5',
			
			/**
			 * API References
			 */
			api: {
				facebook: {
					session: false,		//Verifica si usuario esta logeado
					initset: false,		//Verifica si API ha cargado
					
					login: function(_scope, _fnCallback) {
						if(typeof _scope === 'function') {
							_fnCallback = _scope;
							_scope = 'email';
						}
						if(!_scope) {
							_scope = 'email';
						}

						FB.login(function(data){								
							if (data.authResponse) {
								FB.api('/me', function(usuario){
									if(usuario.id) {
										/*if(!usuario.email) {
											if(_fnCallback)
												_fnCallback(false, undefined);
											return;
										}*/

										mv.api.facebook.session = true;
										if (_fnCallback) 
											_fnCallback(true, usuario);	
									}
								});
							} else {
								if (_fnCallback) 
									_fnCallback(false, undefined);
							}
						}, {
							scope: _scope,
							auth_type: 'rerequest'
						});
					},
					
					logout: function(_fnCallback) {
						if(FB.getAuthResponse() != null) {
							FB.logout(function(data){
								if (_fnCallback)
									_fnCallback(true, data);
							});
						} else {
							if (_fnCallback)
								_fnCallback(false);
						}
					},
					
					publicar: function(_opciones, _fnCallback) {				
						var objBase = {
							mensaje: 'Estoy participando, participa tu también!',
							titulo: 'titulo',
							link: window.location.href,
							descripcion: 'Lorem ipsum',
							imagen: '/views/img/logo.png'
						};
						mv.fn.extender(objBase, _opciones);
						
						var adaptador = {
							message: mv.fn.fbEncode(objBase.mensaje),
							name: objBase.titulo,
							link: objBase.link,
							description: objBase.descripcion,
							caption: '',
							picture: objBase.imagen
						};
						
						FB.api('/me/feed', 'post', adaptador, function(response) {
							if (!response || response.error) {
								if(_fnCallback)
									_fnCallback(false);
							
							} else {
								if(_fnCallback)
									_fnCallback(true, response);
							}
						});
					}, //api.facebook.publicar
					
					compartir: function(_opciones, _fnCallback) {
						var objBase = {
							bajada: null,
							titulo: 'titulo',
							link: window.location.href,
							descripcion: 'Lorem ipsum',
							imagen: '/views/img/logo.png'
						};
						mv.fn.extender(objBase, _opciones);
						
						FB.ui({
							method: 'feed',
							name: objBase.titulo,
							link: objBase.link,
							picture: objBase.imagen,
							caption: objBase.bajada,
							description: objBase.descripcion

						}, function(response){
							if(_fnCallback)
								_fnCallback(response);
						});
					},

					compartirOg: function(_url) {
						if(!_url) _url = window.location.href;
						var url = "https://www.facebook.com/sharer/sharer.php?u="+_url;
						mv.fn.popup(680, 380, url);
					},
					
					invitarAmigos: function(_msg, _ids, _fnCallback) {
						if(!_msg) _msg = 'Únete!';

						var config = {
						    method: 'apprequests',
						    message: _msg
						};

						if(typeof _ids === 'object') { //=array
							mv.fn.extender(config, {to: _ids});
						}
						if(typeof _ids === 'function') {
							_fnCallback = _ids;
						}
						
						FB.ui(config, function(data) {
						    if(_fnCallback)
								_fnCallback(data);
						});
					}
					
				}, //api.facebook
				
				twitter: {			
					login: function() {
						var random = parseInt(Math.random()*99999);
						var url = BASE_URL+'/twitter/callback/'+random;
						mv.fn.popup(785, 440, url);
					},
					compartir: function(_msg, _url, _via) {
						if(!_msg) _msg = "Participa!";

						_url = (typeof _url !== 'undefined') ? "&url="+encodeURIComponent(_url) : '';
						_via = (typeof _via !== 'undefined') ? "&via="+_via : '';

						var url = "http://twitter.com/intent/tweet?text="+_msg+_url+_via;
						mv.fn.popup(640,380, url);
					}
				},

				gplus: {
					compartir: function(_url) {
						if(!_url) _url = window.location.href;
						var url = "https://plus.google.com/share?hl=es-419&url="+encodeURIComponent(_url);
						mv.fn.popup(500,400, url);
					}
				}
			}, //api
			
			/**
			 * Helpers
			 */
			fn: {
				extender: function(e, m) {
					var e = e || this;
					for(var x in m) e[x] = m[x];
					return e;
				},
				
				popup: function(ancho, alto, url) {
					if(!ancho) ancho = 615;
					if(!alto) alto = 340;
					
					var anchoPopup = ancho, altoPopup = alto;
			        var altoVentana = screen.height;
			        var anchoVentana = screen.width;
			        var left = Math.round((anchoVentana / 2) - (anchoPopup / 2));
			        var top = Math.round((altoVentana / 2) - (altoPopup / 2)); //0
					
				 	var popup = window.open(url, "mv_popup", "left="+left+",top="+top+",width="+anchoPopup+",height="+altoPopup+",personalbar=0,toolbar=0,scrollbars=0,resizable=0");
			        if (popup) popup.focus();
				},
				
				tildeEncode: function(str) {			
					str = str.replace(/ /g,'%20');
					str = str.replace(/&aacute;/g,'%E1');
					str = str.replace(/&eacute;/g,'%E9');
					str = str.replace(/&iacute;/g,'%ED');
					str = str.replace(/&oacute;/g,'%F3');
					str = str.replace(/&uacute;/g,'%FA');
					str = str.replace(/&iquest;/g,'%BF');
					str = str.replace(/&iexcl;/g,'%A1');
					str = str.replace(/&ntilde;/g,'%F1');
					str = str.replace(/&Ntilde;/g,'%D1');
					return str;
				},
				
				tildeDecode: function(str) {
					str = str.replace(/%20/g,' ');
					str = str.replace(/%E1/g,'&aacute;');
					str = str.replace(/%E9/g,'&eacute;');
					str = str.replace(/%ED/g,'&iacute;');
					str = str.replace(/%F3/g,'&oacute;');
					str = str.replace(/%FA/g,'&uacute;');
					str = str.replace(/%BF/g,'&iquest;');
					str = str.replace(/%A1/g,'&iexcl;');
					str = str.replace(/%F1/g,'&ntilde;');
					str = str.replace(/%D1/g,'&Ntilde;');
					return str;
				},
				
				fbEncode: function(str) {
					str = str.replace(/&aacute;/g, '\xE1');
					str = str.replace(/&eacute;/g, '\xE9');
					str = str.replace(/&iacute;/g, '\xED');
					str = str.replace(/&oacute;/g, '\xF3');
					str = str.replace(/&uacute;/g, '\xFA');
					str = str.replace(/&iquest;/g, '\xBF');
					str = str.replace(/&iexcl;/g, '\xA1');
					str = str.replace(/&ntilde;/g, '\xF1');
					str = str.replace(/&Ntilde;/g, '\xD1');
					return str;
				}
			} //fn
		};

		//Carga asincrona de FB
		window.fbAsyncInit = function() {
			FB.init({
				appId: FB_API_KEY,
				status: true, // check login status
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true, // parse XFBML
				oauth: true
			});
			if(FB.getAuthResponse() != null) {
				mv.api.facebook.session = true;
			}
			mv.api.facebook.initset = true;
		};
		
		// Return
		return interfaces;

	})(); 

	// Publica en ambiente global.
	window.mv = mvsociales;
})( window, document );

