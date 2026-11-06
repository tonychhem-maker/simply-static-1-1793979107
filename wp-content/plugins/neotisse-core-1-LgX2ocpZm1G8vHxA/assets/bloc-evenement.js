( function ( blocks, element, blockEditor, components ) {
	var el = element.createElement;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var SelectControl = components.SelectControl;

	blocks.registerBlockType( 'neotisse/evenement', {
		title: 'Événement (carte)',
		description: 'Affiche le mois, les jours ou le lieu de l’événement de la carte.',
		icon: 'calendar-alt',
		category: 'widgets',
		attributes: {
			champ: { type: 'string', default: 'mois' }
		},
		edit: function ( props ) {
			var champ = props.attributes.champ;
			var libelles = { mois: 'Mois et année', jours: 'Jours', lieu: 'Type de lieu ou structure' };
			return el(
				'div',
				{ className: 'neotisse-bloc-evenement-edition' },
				el( InspectorControls, null,
					el( PanelBody, { title: 'Champ affiché', initialOpen: true },
						el( SelectControl, {
							label: 'Champ',
							value: champ,
							options: [
								{ label: 'Mois et année', value: 'mois' },
								{ label: 'Jours', value: 'jours' },
								{ label: 'Type de lieu ou structure', value: 'lieu' }
							],
							onChange: function ( valeur ) { props.setAttributes( { champ: valeur } ); }
						} )
					)
				),
				el( 'p', { style: { color: '#36985D', fontStyle: 'italic', margin: 0 } },
					'[Événement : ' + libelles[ champ ] + ']'
				)
			);
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components );
