(function(window, undefined) {

	// Config
	if(!window.FB_API_KEY) 
		window.FB_API_KEY = 428251410528247;

	// Entorno privado
	var mvsociales = (function() {
		var mv = {
			version: '1.4',
			
			/**
			 * API References
			 */
			api: {
				facebook: {
					session: false,		//Verifica si usuario esta logeado
					initset: false,		//Verifica si API ha cargado
					
					login: function(_fnCallback, _fnPreloaderCallback) {
						FB.login(function(data){
							if(_fnPreloaderCallback) 
								_fnPreloaderCallback();
								
							if (data.authResponse) {
								FB.api('/me', function(usuario){
									if(usuario.id) {
										mv.api.facebook.session = true;
										if (_fnCallback) 
											_fnCallback(true, usuario);	
									}
								});
							} else {
								if (_fnCallback) 
									_fnCallback(false, {});
							}
						}, {
							//scope: 'email,publish_stream'
							scope: 'email'
						});
					},
					
					logout: function(_fnCallback) {
						if(FB.getAuthResponse() != null) {
							FB.logout(function(data){
								if (_fnCallback) _fnCallback();
							});
						} else {
							if (_fnCallback) _fnCallback();
						}
					},
					
					publicar: function(opciones, _fnCallback) {				
						var objBase = {
							mensaje: 'Estoy participando, participa tu también!',
							titulo: 'titulo',
							link: window.location.href,
							descripcion: 'Lorem ipsum',
							imagen: FULL_PATH+'/views/img/logo.png'
						};
						mv.fn.extender(objBase, opciones);
						
						var adaptador = {
							message: mv.fn.fbEncode(objBase.mensaje),
							name: objBase.titulo,
							link: objBase.link,
							description: objBase.descripcion,
							caption: '',
							picture: objBase.imagen
						};
						
						FB.api('/me/feed', 'post', adaptador, function(response) {
							//console.log(response);
							if (!response || response.error) {
								/*if (!mv.api.facebook.session) {
									mv.api.facebook.login(function() {
										mv.api.facebook.like(opciones, boton);
									});
								}*/
							
							//Callback
							} else {
								if(_fnCallback) _fnCallback();
							}
						});
					}, //api.facebook.publicar
					
					compartir: function(opciones, _fnCallback) {
						var objBase = {
							mensaje: 'Estoy participando, participa tu también!',
							titulo: 'titulo',
							link: window.location.href,
							descripcion: 'Lorem ipsum',
							imagen: FULL_PATH+'/views/img/logo.png'
						};
						mv.fn.extender(objBase, opciones);
						
						FB.ui({
							method: 'stream.publish',
							message: mv.fn.fbEncode(objBase.mensaje),
							attachment: {
								name: objBase.titulo,
								description: objBase.descripcion,
								href: objBase.link,
								media: [{
									type: 'image',
									href: objBase.link,
									src: objBase.imagen
								}]
							}
						}, function(response){
							//console.log(response);
						});
					},
					
					invitarAmigos: function(msg, ids, _fnCallback) {
						if(!msg) msg = 'Únete!';
						
						FB.ui({
						    method: 'apprequests',
						    message: msg,
							to: ids
						}, function(data) {
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
					compartir: function(msg, url) {
						if(!msg) msg = "Participa!";
						if(!url) url = window.location.href;

						var url = "http://twitter.com/intent/tweet?status="+msg+" "+encodeURIComponent(url);
						mv.fn.popup(640,380, url);
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
				
				lightbox: function(ancho, alto, url) {
					var documentHeight, documentWidth;
					if(mv.fn.getIEVersion() != -1) {
						documentHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.documentElement.clientHeight:document.body.clientHeight;
						documentWidth = document.documentElement.clientWidth;
					} else {
						documentHeight = (document.height<window.innerHeight)?window.innerHeight:document.height || document.body.clientHeight;
						documentWidth = document.width || document.documentElement.clientWidth;
					}
					
					var overlay = document.createElement('div');
					overlay.id = "MVLBOverlay";
					overlay.style.width = documentWidth+'px';
					overlay.style.height = documentHeight+'px';
					document.body.appendChild(overlay);
					
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					var lb = document.createElement('div');
					lb.id = 'MVLBLightbox';
					lb.style.width = ancho+'px';
					lb.style.height = alto+'px';
					lb.style.left = parseInt(documentWidth/2)-parseInt(ancho/2) +'px';
					lb.style.top = scrollTop + 80 +'px';
					lb.innerHTML = '<iframe frameborder="no" border="no" allowtransparency="yes" width="'+ancho+'" height="'+alto+'" src="'+url+'"></iframe>';
					document.body.appendChild(lb);
					
					var cerrar = document.createElement('a');
					cerrar.id = "MVLBCerrar";
					lb.appendChild(cerrar);
					cerrar.onclick = function() {
						overlay.parentNode.removeChild(overlay);
						lb.parentNode.removeChild(lb);
					};
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

		window.fbAsyncInit = function() {
			FB.init({
				appId: FB_API_KEY,
				status: true, // check login status
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true, // parse XFBML
				oauth: true
			});
			if (FB.getAuthResponse() != null) {
				mv.api.facebook.session = true;
			}
			mv.api.facebook.initset = true;
		};
		
		// Interfaces
		return {
			facebook: {
				login: function(_fnCallback, _fnPreloaderCallback) {
					mv.api.facebook.login(_fnCallback, _fnPreloaderCallback);
				},
				
				logout: function(_fnCallback) {
					mv.api.facebook.logout(_fnCallback);
				},
				
				publicar: function(objBase, _fnCallback) {
					mv.api.facebook.publicar(objBase, _fnCallback);
				},
				
				compartir: function(objBase, _fnCallback) {
					mv.api.facebook.compartir(objBase, _fnCallback);
				},
				
				invitarAmigos: function(msg, ids, _fnCallback) {
					mv.api.facebook.invitarAmigos(msg, ids, _fnCallback); 
				}
				
			},
			
			/*-- Twitter --*/
			twitter: {
				login: function() {
					mv.api.twitter.login();	
				},
				compartir: function(msg, url) {
					mv.api.twitter.compartir(msg, url);
				}
			}
		};	

	})(); 

	window.mv = mvsociales;
})( window );

