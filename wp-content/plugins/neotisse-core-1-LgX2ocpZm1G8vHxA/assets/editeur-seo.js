/**
 * Aide à la saisie SEO dans l'éditeur : longueur de l'extrait et texte alternatif.
 */
( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.plugins || ! wp.editPost ) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var useSelect = wp.data.useSelect;
	var Panel = wp.editPost.PluginDocumentSettingPanel;

	var LIMITE = 155;

	function avertissement( texte, ton ) {
		var couleurs = {
			bon: '#256B40',
			moyen: '#8A6A00',
			probleme: '#A32020'
		};

		return el(
			'p',
			{ style: { margin: '0 0 8px', color: couleurs[ ton ] || '#1C202C', fontSize: '12px' } },
			texte
		);
	}

	wp.plugins.registerPlugin( 'neotisse-aide-seo', {
		render: function () {
			var donnees = useSelect( function ( select ) {
				var editeur = select( 'core/editor' );

				if ( ! editeur ) {
					return {};
				}

				var extrait = editeur.getEditedPostAttribute( 'excerpt' ) || '';
				var contenu = editeur.getEditedPostAttribute( 'content' ) || '';
				var image = editeur.getEditedPostAttribute( 'featured_media' ) || 0;
				var media = image ? select( 'core' ).getMedia( image ) : null;
				var imagesSansAlt = 0;

				var balisesImg = contenu.match( /<img\b[^>]*>/gi ) || [];
				balisesImg.forEach( function ( balise ) {
					var m = balise.match( /\balt=(["'])(.*?)\1/i );
					if ( ! m || m[2].trim() === '' ) {
						imagesSansAlt++;
					}
				} );

				return {
					extrait: extrait.replace( /<[^>]*>/g, '' ).trim(),
					image: image,
					alt: media ? ( media.alt_text || '' ).trim() : '',
					mediaCharge: media !== undefined && media !== null,
					imagesSansAlt: imagesSansAlt
				};
			}, [] );

			var longueur = ( donnees.extrait || '' ).length;
			var tonExtrait = 'bon';

			if ( ! longueur ) {
				tonExtrait = 'probleme';
			} else if ( longueur > LIMITE ) {
				tonExtrait = 'moyen';
			}

			var messages = [];

			if ( ! longueur ) {
				messages.push( avertissement( 'Extrait vide : il sert de méta description. Renseignez environ 155 caractères.', 'probleme' ) );
			} else if ( longueur > LIMITE ) {
				messages.push( avertissement( 'Extrait : ' + longueur + ' caractères, au-delà de ' + LIMITE + '. Google le coupera.', 'moyen' ) );
			} else {
				messages.push( avertissement( 'Extrait : ' + longueur + ' / ' + LIMITE + ' caractères.', tonExtrait ) );
			}

			if ( ! donnees.image ) {
				messages.push( avertissement( 'Aucune image mise en avant : le partage social utilisera l’image de repli.', 'moyen' ) );
			} else if ( donnees.mediaCharge && ! donnees.alt ) {
				messages.push( avertissement( 'Texte alternatif manquant sur l’image mise en avant.', 'probleme' ) );
			}

			if ( donnees.imagesSansAlt > 0 ) {
				messages.push( avertissement( donnees.imagesSansAlt + ' image(s) dans le contenu sans texte alternatif (alt).', 'probleme' ) );
			}

			return el(
				Panel,
				{ title: __( 'Aide SEO Neotisse', 'neotisse' ), name: 'neotisse-aide-seo' },
				messages
			);
		}
	} );
}( window.wp ) );
