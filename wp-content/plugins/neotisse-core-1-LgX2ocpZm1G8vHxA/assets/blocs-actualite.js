( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var SelectControl = components.SelectControl;

	function apercu( texte ) {
		return el( 'p', { style: { color: '#36985D', fontStyle: 'italic', margin: 0 } }, texte );
	}

	blocks.registerBlockType( 'neotisse/carte-actualite', {
		title: 'Carte d’actualité',
		description: 'Carte d’un article de la boucle : image, catégorie, date, titre, extrait.',
		icon: 'media-document',
		category: 'widgets',
		attributes: {
			variante: { type: 'string', default: 'grille' },
			niveauTitre: { type: 'integer', default: 3 }
		},
		edit: function ( props ) {
			return el(
				'div',
				{ className: 'neotisse-bloc-actualite-edition' },
				el( InspectorControls, null,
					el( PanelBody, { title: 'Présentation', initialOpen: true },
						el( SelectControl, {
							label: 'Variante',
							value: props.attributes.variante,
							options: [
								{ label: 'Grille', value: 'grille' },
								{ label: 'À la une', value: 'une' }
							],
							onChange: function ( valeur ) { props.setAttributes( { variante: valeur } ); }
						} ),
						el( SelectControl, {
							label: 'Niveau du titre',
							value: String( props.attributes.niveauTitre ),
							options: [
								{ label: 'H2', value: '2' },
								{ label: 'H3', value: '3' }
							],
							onChange: function ( valeur ) { props.setAttributes( { niveauTitre: parseInt( valeur, 10 ) } ); }
						} )
					)
				),
				apercu( '[Carte d’actualité : ' + ( props.attributes.variante === 'une' ? 'à la une' : 'grille' ) + ']' )
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/prochain-evenement', {
		title: 'Pastille prochain événement',
		description: 'Affiche la date du prochain événement, si elle existe.',
		icon: 'calendar-alt',
		category: 'widgets',
		edit: function () {
			return apercu( '[Prochain événement]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/filtres-actualites', {
		title: 'Filtres d’actualités',
		description: 'Pastilles de catégories, en vrais liens.',
		icon: 'filter',
		category: 'widgets',
		edit: function () {
			return apercu( '[Filtres : Toutes + catégories]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/infos-evenement', {
		title: 'Infos pratiques (événement)',
		description: 'Encadré date, lieu, adresse et bouton agenda, pour les articles événement.',
		icon: 'info',
		category: 'widgets',
		edit: function () {
			return apercu( '[Infos pratiques : seulement pour un événement complet]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/sommaire-article', {
		title: 'Sommaire de l’article',
		description: 'Liste les titres H2 de l’article (3 minimum).',
		icon: 'list-view',
		category: 'widgets',
		edit: function () {
			return apercu( '[Sommaire : affiché à partir de 3 titres H2]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/articles-lies', {
		title: 'Articles liés',
		description: 'Trois articles de la même catégorie.',
		icon: 'grid-view',
		category: 'widgets',
		edit: function () {
			return apercu( '[3 articles de la même catégorie]' );
		},
		save: function () {
			return null;
		}
	} );
	blocks.registerBlockType( 'neotisse/meta-article', {
		title: 'Méta de l’article',
		description: 'Date en français, temps de lecture et auteur.',
		icon: 'clock',
		category: 'widgets',
		edit: function () {
			return apercu( '[Date · temps de lecture · Par Neotisse]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/partage-article', {
		title: 'Partager l’article',
		description: 'Copier le lien et envoi par e-mail, sans script externe.',
		icon: 'share',
		category: 'widgets',
		edit: function () {
			return apercu( '[Partager : Copier le lien · Par e-mail]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/a-decouvrir', {
		title: 'À découvrir',
		description: 'Liens internes vers les ateliers, les déplacements et le contact.',
		icon: 'admin-links',
		category: 'widgets',
		edit: function () {
			return apercu( '[À découvrir : Ateliers · Déplacements · Contact]' );
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'neotisse/fil-ariane', {
		title: 'Fil d’Ariane',
		description: 'Fil d’Ariane de la page ou de l’article courant.',
		icon: 'arrow-right-alt',
		category: 'widgets',
		edit: function () {
			return apercu( '[Accueil / Actualités / …]' );
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
