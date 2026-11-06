/**
 * Page « Ateliers » : barre de navigation interne collante (scrollspy avec aria-current)
 * et animation optionnelle des chiffres clés (désactivée avec prefers-reduced-motion).
 * La page reste 100 % lisible sans JavaScript.
 */
( function () {
	'use strict';

	var reduireMouvement = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* 1. Scrollspy sur la barre de navigation interne collante */
	var nav = document.querySelector( '.neotisse-nav-ateliers' );
	if ( nav ) {
		var liens = Array.prototype.slice.call( nav.querySelectorAll( 'a[href^="#"]' ) );
		var sections = [];

		liens.forEach( function ( lien ) {
			var id = lien.getAttribute( 'href' ).slice( 1 );
			var cible = document.getElementById( id );
			if ( cible ) {
				sections.push( { id: id, el: cible, lien: lien } );
			}
		} );

		var activerLien = function ( idActif ) {
			liens.forEach( function ( lien ) {
				var estActif = lien.getAttribute( 'href' ) === '#' + idActif;
				lien.classList.toggle( 'is-actif', estActif );
				if ( estActif ) {
					lien.setAttribute( 'aria-current', 'location' );
				} else {
					lien.removeAttribute( 'aria-current' );
				}
			} );
		};

		if ( sections.length && 'IntersectionObserver' in window ) {
			var observateur = new IntersectionObserver(
				function ( entrees ) {
					entrees.forEach( function ( entree ) {
						if ( entree.isIntersecting ) {
							activerLien( entree.target.id );
						}
					} );
				},
				{ rootMargin: '-22% 0px -65% 0px', threshold: 0 }
			);

			sections.forEach( function ( item ) {
				observateur.observe( item.el );
			} );
		}
	}

	/* 2. Animation discrète des chiffres clés (si renseignés et si le mouvement n'est pas réduit) */
	if ( ! reduireMouvement && 'IntersectionObserver' in window ) {
		var compteurs = document.querySelectorAll( '.neotisse-chiffres__valeur[data-compteur]' );
		if ( compteurs.length ) {
			var obsChiffres = new IntersectionObserver(
				function ( entrees, obs ) {
					entrees.forEach( function ( entree ) {
						if ( ! entree.isIntersecting ) {
							return;
						}
						var el = entree.target;
						obs.unobserve( el );

						var brut = el.getAttribute( 'data-compteur' ) || '';
						var correspondance = brut.match( /^([^0-9]*)([0-9]+)(.*)$/ );
						if ( ! correspondance ) {
							return;
						}

						var prefixe = correspondance[1];
						var cibleNum = parseInt( correspondance[2], 10 );
						var suffixe = correspondance[3];

						if ( isNaN( cibleNum ) || cibleNum <= 0 ) {
							return;
						}

						var debut = null;
						var duree = 900;

						var etape = function ( timestamp ) {
							if ( ! debut ) {
								debut = timestamp;
							}
							var progres = Math.min( 1, ( timestamp - debut ) / duree );
							var actuel = Math.round( progres * cibleNum );
							el.textContent = prefixe + actuel + suffixe;
							if ( progres < 1 ) {
								window.requestAnimationFrame( etape );
							} else {
								el.textContent = brut;
							}
						};

						window.requestAnimationFrame( etape );
					} );
				},
				{ threshold: 0.4 }
			);

			compteurs.forEach( function ( c ) {
				obsChiffres.observe( c );
			} );
		}
	}
}() );
