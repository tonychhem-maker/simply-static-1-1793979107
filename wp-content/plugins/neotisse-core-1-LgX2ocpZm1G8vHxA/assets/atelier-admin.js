( function ( $ ) {
	'use strict';

	/* 1. Sélecteur de photo unique (collage d'un atelier ou hero de la page Ateliers) */
	$( document ).on( 'click', '.neotisse-photo-choisir', function ( evenement ) {
		evenement.preventDefault();
		var champ = $( this ).closest( '.neotisse-photo-champ' );
		var cadre = wp.media( { title: 'Choisir une image', multiple: false, library: { type: 'image' } } );

		cadre.on( 'select', function () {
			var image = cadre.state().get( 'selection' ).first().toJSON();
			var url = image.sizes && image.sizes.thumbnail ? image.sizes.thumbnail.url : image.url;
			champ.find( 'input[type=hidden]' ).val( image.id );
			champ.find( '.neotisse-photo-apercu' ).html( '<img src="' + url + '" alt="" style="max-width:100%;height:auto">' );
		} );

		cadre.open();
	} );

	$( document ).on( 'click', '.neotisse-photo-retirer', function ( evenement ) {
		evenement.preventDefault();
		var champ = $( this ).closest( '.neotisse-photo-champ' );
		champ.find( 'input[type=hidden]' ).val( '' );
		champ.find( '.neotisse-photo-apercu' ).empty();
	} );

	/* 2. Sélecteur multiple de la galerie « En images » (jusqu'à 9 photos) */
	$( document ).on( 'click', '#neotisse-galerie-choisir', function ( evenement ) {
		evenement.preventDefault();
		var cadre = wp.media( {
			title: 'Choisir 6 à 9 photos pour la galerie',
			button: { text: 'Utiliser ces photos' },
			multiple: true,
			library: { type: 'image' }
		} );

		cadre.on( 'select', function () {
			var selection = cadre.state().get( 'selection' ).toJSON().slice( 0, 9 );
			var ids = [];
			var html = '';

			selection.forEach( function ( img ) {
				ids.push( img.id );
				var url = img.sizes && img.sizes.thumbnail ? img.sizes.thumbnail.url : img.url;
				var altOk = img.alt && img.alt.trim() !== '';
				html += '<div style="border:1px solid ' + ( altOk ? '#ccd0d4' : '#d63638' ) + ';padding:6px;background:#fff;border-radius:4px;text-align:center;width:110px">'
					+ '<img src="' + url + '" alt="" style="width:96px;height:96px;object-fit:cover">'
					+ '<span style="display:block;color:' + ( altOk ? '#256B40' : '#d63638' ) + ';font-size:11px;margin-top:4px">'
					+ ( altOk ? '✓ Alt renseigné' : '⚠️ Alt manquant' )
					+ '</span></div>';
			} );

			$( '#neotisse_galerie_ids' ).val( ids.join( ',' ) );
			$( '#neotisse-galerie-apercu' ).html( html );
		} );

		cadre.open();
	} );

	$( document ).on( 'click', '#neotisse-galerie-vider', function ( evenement ) {
		evenement.preventDefault();
		$( '#neotisse_galerie_ids' ).val( '' );
		$( '#neotisse-galerie-apercu' ).empty();
	} );

	/* 3. Sélecteur du dossier de présentation PDF */
	$( document ).on( 'click', '#neotisse-pdf-choisir', function ( evenement ) {
		evenement.preventDefault();
		var cadre = wp.media( {
			title: 'Choisir le dossier de présentation (PDF)',
			button: { text: 'Choisir ce fichier' },
			multiple: false,
			library: { type: 'application/pdf' }
		} );

		cadre.on( 'select', function () {
			var fichier = cadre.state().get( 'selection' ).first().toJSON();
			$( '#neotisse_pdf_id' ).val( fichier.id );
			var info = fichier.filename || fichier.title || 'Document PDF';
			if ( fichier.filesizeHumanReadable ) {
				info += ' (PDF — ' + fichier.filesizeHumanReadable + ')';
			}
			$( '#neotisse-pdf-apercu' ).html( '<strong>' + info + '</strong>' );
		} );

		cadre.open();
	} );

	$( document ).on( 'click', '#neotisse-pdf-retirer', function ( evenement ) {
		evenement.preventDefault();
		$( '#neotisse_pdf_id' ).val( '0' );
		$( '#neotisse-pdf-apercu' ).html( '<em>Aucun fichier PDF sélectionné.</em>' );
	} );
} )( jQuery );
