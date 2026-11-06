/**
 * Actualités : copier le lien, partage natif, sommaire actif et progression de lecture.
 */
( function () {
	'use strict';

	var partage = document.querySelector( '.neotisse-partage' );

	/* Copier le lien de l'article. */
	document.querySelectorAll( '.js-copier-lien' ).forEach( function ( bouton ) {
		bouton.addEventListener( 'click', function () {
			var bloc = bouton.closest( '.neotisse-partage' );
			var lien = bloc ? bloc.getAttribute( 'data-lien' ) : window.location.href;
			var confirmation = bloc ? bloc.querySelector( '.neotisse-partage__confirmation' ) : null;

			function annoncer( message ) {
				if ( confirmation ) {
					confirmation.textContent = message;
				}
			}

			if ( navigator.clipboard && navigator.clipboard.writeText ) {
				navigator.clipboard.writeText( lien ).then( function () {
					annoncer( 'Lien copié' );
				} ).catch( function () {
					annoncer( 'Copie impossible, sélectionnez le lien manuellement.' );
				} );
				return;
			}

			var champ = document.createElement( 'input' );
			champ.value = lien;
			document.body.appendChild( champ );
			champ.select();

			try {
				document.execCommand( 'copy' );
				annoncer( 'Lien copié' );
			} catch ( erreur ) {
				annoncer( 'Copie impossible, sélectionnez le lien manuellement.' );
			}

			document.body.removeChild( champ );
		} );
	} );

	/* Partage natif, quand le navigateur le propose. */
	var boutonNatif = document.querySelector( '.js-partager-natif' );

	if ( boutonNatif && navigator.share && partage ) {
		boutonNatif.hidden = false;
		boutonNatif.addEventListener( 'click', function () {
			navigator.share( {
				title: partage.getAttribute( 'data-titre' ) || document.title,
				url: partage.getAttribute( 'data-lien' ) || window.location.href
			} ).catch( function () {} );
		} );
	}

	/* Sommaire : mettre en évidence le titre visible. */
	var sommaire = document.querySelector( '.neotisse-sommaire' );

	if ( sommaire && 'IntersectionObserver' in window ) {
		var liens = Array.prototype.slice.call( sommaire.querySelectorAll( 'a[href^="#"]' ) );
		var cibles = liens.map( function ( lien ) {
			return document.getElementById( lien.getAttribute( 'href' ).slice( 1 ) );
		} ).filter( Boolean );

		if ( cibles.length ) {
			var observateur = new IntersectionObserver( function ( entrees ) {
				entrees.forEach( function ( entree ) {
					if ( ! entree.isIntersecting ) {
						return;
					}

					liens.forEach( function ( lien ) {
						lien.classList.toggle( 'is-actif', lien.getAttribute( 'href' ) === '#' + entree.target.id );
					} );
				} );
			}, { rootMargin: '-20% 0px -65% 0px' } );

			cibles.forEach( function ( cible ) {
				observateur.observe( cible );
			} );
		}
	}

	/* Barre de progression de lecture. */
	var barre = document.querySelector( '.neotisse-progression__barre' );

	if ( barre ) {
		var actualiser = function () {
			var hauteur = document.documentElement.scrollHeight - window.innerHeight;
			var ratio = hauteur > 0 ? Math.min( 1, window.scrollY / hauteur ) : 0;
			barre.style.transform = 'scaleX(' + ratio + ')';
		};

		window.addEventListener( 'scroll', actualiser, { passive: true } );
		window.addEventListener( 'resize', actualiser );
		actualiser();
	}
}() );
