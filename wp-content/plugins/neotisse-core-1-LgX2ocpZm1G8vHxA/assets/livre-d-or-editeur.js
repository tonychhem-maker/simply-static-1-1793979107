/**
 * Livre d'or : enregistrement du bloc dans l'éditeur.
 */
(function (wp) {
	'use strict';

	if (!wp || !wp.blocks || !wp.element) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var bloc = wp.blockEditor || wp.editor;

	wp.blocks.registerBlockType('neotisse/livre-dor', {
		title: __('Livre d’or', 'neotisse'),
		description: __(
			'Affiche la page du livre d’or, ou un aperçu de trois messages selon l’option choisie.',
			'neotisse'
		),
		icon: 'format-quote',
		category: 'widgets',
		attributes: {
			vue: { type: 'string', default: 'page' }
		},
		edit: function (props) {
			var options = [
				{ label: __('Page complète', 'neotisse'), value: 'page' },
				{ label: __('Aperçu (3 messages)', 'neotisse'), value: 'apercu' }
			];

			var selecteur = bloc && bloc.InspectorControls
				? el(
						bloc.InspectorControls,
						{},
						el(
							'div',
							{ className: 'components-panel__body is-opened' },
							el('h2', { className: 'components-panel__body-title' }, __('Affichage', 'neotisse')),
							el(
								'select',
								{
									value: props.attributes.vue,
									onChange: function (evenement) {
										props.setAttributes({ vue: evenement.target.value });
									}
								},
								options.map(function (option) {
									return el('option', { key: option.value, value: option.value }, option.label);
								})
							)
						)
				  )
				: null;

			return el(
				'div',
				{ className: 'neotisse-livre-dor-editeur' },
				selecteur,
				el(
					'p',
					{},
					props.attributes.vue === 'apercu'
						? __('Aperçu du livre d’or : trois derniers messages et deux boutons.', 'neotisse')
						: __('Page complète du livre d’or : hero, grille de messages, bande de clôture et formulaire.', 'neotisse')
				),
				el(
					'p',
					{ style: { fontStyle: 'italic' } },
					__('Le rendu réel s’affiche sur le site.', 'neotisse')
				)
			);
		},
		save: function () {
			return null;
		}
	});
})(window.wp);
