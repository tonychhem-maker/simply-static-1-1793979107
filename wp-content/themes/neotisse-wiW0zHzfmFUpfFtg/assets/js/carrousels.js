/**
 * Carrousels et changement de membre de l'équipe.
 * Sans JavaScript, toutes les cartes restent visibles dans la grille.
 */
( function () {
	'use strict';

	var reduireMouvement = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	function initCarrousel( conteneur ) {
		var piste = conteneur.querySelector( '.neotisse-carrousel__piste' );
		if ( ! piste ) {
			return;
		}

		var precedent = conteneur.querySelector( '.neotisse-carrousel__precedent' );
		var suivant = conteneur.querySelector( '.neotisse-carrousel__suivant' );

		function pasCarte() {
			var carte = piste.querySelector( 'li' );
			if ( ! carte ) {
				return piste.clientWidth * 0.8;
			}
			var ecart = parseFloat( window.getComputedStyle( piste ).columnGap ) || 0;
			return carte.getBoundingClientRect().width + ecart;
		}

		function majEtat() {
			var max = piste.scrollWidth - piste.clientWidth - 2;
			if ( precedent ) {
				precedent.disabled = piste.scrollLeft <= 2;
			}
			if ( suivant ) {
				suivant.disabled = piste.scrollLeft >= max;
			}
		}

		function defiler( sens ) {
			var cible = piste.scrollLeft + sens * pasCarte();
			cible = Math.max( 0, Math.min( cible, piste.scrollWidth - piste.clientWidth ) );
			piste.scrollTo( { left: cible, behavior: reduireMouvement ? 'auto' : 'smooth' } );
		}

		piste.addEventListener( 'scroll', majEtat, { passive: true } );
		window.addEventListener( 'resize', majEtat );
		majEtat();

		if ( precedent ) {
			precedent.addEventListener( 'click', function ( evenement ) {
				evenement.preventDefault();
				defiler( -1 );
			} );
		}
		if ( suivant ) {
			suivant.addEventListener( 'click', function ( evenement ) {
				evenement.preventDefault();
				defiler( 1 );
			} );
		}
	}

	function initEquipe( conteneur ) {
		var fiches = conteneur.querySelectorAll( '.neotisse-equipe__fiche' );
		var bouton = conteneur.querySelector( '.neotisse-equipe__suivant' );
		if ( fiches.length < 2 || ! bouton ) {
			return;
		}

		var index = 0;

		function afficher( i ) {
			fiches.forEach( function ( fiche, n ) {
				var actif = n === i;
				fiche.hidden = ! actif;
				fiche.setAttribute( 'aria-hidden', actif ? 'false' : 'true' );
			} );
		}

		bouton.addEventListener( 'click', function ( evenement ) {
			evenement.preventDefault();
			index = ( index + 1 ) % fiches.length;
			afficher( index );
		} );

		afficher( index );
	}

	document.querySelectorAll( '.neotisse-carrousel' ).forEach( initCarrousel );
	document.querySelectorAll( '.neotisse-equipe' ).forEach( initEquipe );
} )();
