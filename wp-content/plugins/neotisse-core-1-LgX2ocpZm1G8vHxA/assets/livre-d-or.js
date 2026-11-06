/**
 * Livre d'or : dialogue accessible, compteur, dépliage et « Voir plus ».
 */
(function () {
	'use strict';

	var config = window.neotisseLivreDor || {};
	var dialogue = document.getElementById('ld-dialogue');
	var ouvertPar = null;

	function textes(cle, repli) {
		return config[cle] ? config[cle] : repli;
	}

	/* ---------- Dialogue ---------- */

	function ouvrirDialogue(declencheur) {
		if (!dialogue) {
			return;
		}

		ouvertPar = declencheur || document.activeElement;
		dialogue.hidden = false;

		if (typeof dialogue.showModal === 'function') {
			dialogue.showModal();
		} else {
			dialogue.setAttribute('open', 'open');
		}

		var premier = dialogue.querySelector('.ld-form input:not([type="hidden"]):not([type="checkbox"]), .ld-form select, .ld-form textarea');

		if (!premier) {
			premier = dialogue.querySelector('button, a[href]');
		}

		if (premier) {
			premier.focus();
			premier.scrollIntoView({ block: 'nearest' });
		}

		var cta = document.querySelector('.ld-cta-mobile');
		if (cta) {
			cta.hidden = true;
		}
	}

	function fermerDialogue() {
		if (!dialogue) {
			return;
		}

		if (typeof dialogue.close === 'function' && dialogue.open) {
			dialogue.close();
		} else {
			dialogue.removeAttribute('open');
			dialogue.hidden = true;
		}

		var cta = document.querySelector('.ld-cta-mobile');
		if (cta) {
			cta.hidden = false;
		}

		if (ouvertPar && typeof ouvertPar.focus === 'function') {
			ouvertPar.focus();
		}
	}

	document.addEventListener('click', function (evenement) {
		var ouvrir = evenement.target.closest('[data-ld-ouvrir]');

		if (ouvrir) {
			if (!dialogue) {
				return;
			}

			evenement.preventDefault();
			ouvrirDialogue(ouvrir);
			return;
		}

		if (evenement.target.closest('[data-ld-fermer]')) {
			evenement.preventDefault();
			fermerDialogue();
			return;
		}

		var deplier = evenement.target.closest('.ld-carte__suite');

		if (deplier) {
			evenement.preventDefault();
			var zone = deplier.closest('.ld-carte__texte');
			if (zone) {
				var ouvert = zone.classList.toggle('est-ouvert');
				deplier.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
				deplier.setAttribute('data-ouvert', ouvert ? '1' : '0');
				var libelleSuite = deplier.querySelector('.ld-carte__suite-texte');
				if (libelleSuite) {
					libelleSuite.textContent = ouvert
						? textes('reduire', 'Réduire')
						: textes('lireSuite', 'Lire la suite');
				}
			}
			return;
		}

		var reponse = evenement.target.closest('.ld-reponse__suite');

		if (reponse) {
			evenement.preventDefault();
			var boite = reponse.closest('.ld-reponse');
			if (boite) {
				var ouvertReponse = boite.classList.toggle('est-ouvert');
				reponse.setAttribute('aria-expanded', ouvertReponse ? 'true' : 'false');
				var libelleReponse = reponse.querySelector('.ld-reponse__suite-texte');
				if (libelleReponse) {
					libelleReponse.textContent = ouvertReponse
						? textes('reduire', 'Réduire')
						: textes('lireReponse', 'Lire la réponse');
				}
			}
		}
	});

	if (dialogue) {
		dialogue.addEventListener('close', function () {
			var cta = document.querySelector('.ld-cta-mobile');
			if (cta) {
				cta.hidden = false;
			}

			if (ouvertPar && typeof ouvertPar.focus === 'function') {
				ouvertPar.focus();
			}
		});

		dialogue.addEventListener('click', function (evenement) {
			if (evenement.target === dialogue) {
				fermerDialogue();
			}
		});
	}

	/* Ouverture directe depuis /livre-d-or/?mot=... après une redirection. */

	if (dialogue && /(?:\?|&)mot=/.test(window.location.search)) {
		ouvrirDialogue(null);
	}

	/* ---------- Compteur de caractères ---------- */

	document.querySelectorAll('[data-ld-compteur]').forEach(function (compteur) {
		var champ = document.getElementById(compteur.id.replace(/compteur$/, 'message'));

		if (!champ) {
			return;
		}

		var min = parseInt(champ.getAttribute('data-ld-min') || '0', 10);
		var max = parseInt(champ.getAttribute('data-ld-max') || '600', 10);

		function actualiser() {
			var valeur = champ.value.length;
			compteur.textContent = valeur + ' / ' + max;
			compteur.classList.toggle('est-invalide', valeur > 0 && valeur < min);
		}

		champ.addEventListener('input', actualiser);
		actualiser();
	});

	/* ---------- Validation côté navigateur ---------- */

	document.querySelectorAll('[data-ld-form]').forEach(function (formulaire) {
		var zoneErreur = formulaire.querySelector('.ld-erreurs');

		formulaire.addEventListener('submit', function (evenement) {
			var erreurs = [];
			var premierChamp = null;

			formulaire.querySelectorAll('[required]').forEach(function (champ) {
				var valide = champ.type === 'checkbox' ? champ.checked : champ.value.trim() !== '';

				if (champ.type === 'email' && champ.value.trim() !== '') {
					valide = valide && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value.trim());
				}

				var conteneur = champ.closest('.ld-champ') || champ.closest('.ld-case');

				if (conteneur) {
					conteneur.classList.toggle('est-invalide', !valide);
				}

				if (!valide) {
					var etiquette = formulaire.querySelector('label[for="' + champ.id + '"]');
					erreurs.push((etiquette ? etiquette.textContent : champ.name).replace('*', '').trim());
					premierChamp = premierChamp || champ;
				}
			});

			if (erreurs.length > 0) {
				evenement.preventDefault();

				if (zoneErreur) {
					var liste = zoneErreur.querySelector('ul');
					if (liste) {
						liste.innerHTML = '';
						erreurs.forEach(function (texte) {
							var item = document.createElement('li');
							var lien = document.createElement('a');
							lien.href = '#';
							lien.textContent = texte;
							item.appendChild(lien);
							liste.appendChild(item);
						});
					}
					zoneErreur.hidden = false;
					zoneErreur.focus();
				}

				if (premierChamp) {
					premierChamp.focus();
				}
				return;
			}

			var bouton = formulaire.querySelector('.ld-submit');
			if (bouton) {
				bouton.disabled = true;
				var texte = bouton.querySelector('.ld-submit__texte');
				var attente = bouton.querySelector('.ld-submit__attente');
				if (texte) {
					texte.hidden = true;
				}
				if (attente) {
					attente.hidden = false;
				}
			}
		});
	});

	/* ---------- Voir plus ---------- */

	var boutonPlus = document.getElementById('ld-plus');

	if (boutonPlus && config.rest) {
		boutonPlus.addEventListener('click', function () {
			var page = parseInt(boutonPlus.getAttribute('data-page') || '1', 10);
			var grille = document.getElementById('ld-grille');
			var libelle = boutonPlus.querySelector('.ld-galet');
			var texteInitial = boutonPlus.textContent;

			if (!grille) {
				return;
			}

			boutonPlus.disabled = true;
			boutonPlus.textContent = textes('chargement', 'Chargement…');

			fetch(config.rest + (config.rest.indexOf('?') === -1 ? '?' : '&') + 'page=' + (page + 1), {
				headers: { 'X-WP-Nonce': config.nonce || '' },
				credentials: 'same-origin'
			})
				.then(function (reponse) {
					if (!reponse.ok) {
						throw new Error('HTTP ' + reponse.status);
					}
					return reponse.json();
				})
				.then(function (donnees) {
					if (!donnees || !donnees.html) {
						throw new Error('Réponse vide');
					}

					var temporaire = document.createElement('div');
					temporaire.innerHTML = donnees.html;

					var cartes = Array.prototype.slice.call(temporaire.children);
					cartes.forEach(function (carte) {
						grille.appendChild(carte);
					});

					var annonce = document.getElementById('ld-annonce');
					if (annonce) {
						annonce.textContent = 1 === cartes.length
							? textes('ajouteUn', '1 message ajouté')
							: textes('ajoutes', '%s messages ajoutés').replace('%s', String(cartes.length));
					}

					var premiere = cartes[0];
					if (premiere) {
						premiere.setAttribute('tabindex', '-1');
						premiere.focus();
					}

					boutonPlus.setAttribute('data-page', String(page + 1));
					boutonPlus.disabled = false;
					boutonPlus.textContent = texteInitial;

					if (libelle) {
						libelle.className = 'ld-galet';
					}

					if (!donnees.hasMore) {
						boutonPlus.remove();
					}
				})
				.catch(function () {
					boutonPlus.disabled = false;
					boutonPlus.textContent = texteInitial;
					var annonce = document.getElementById('ld-annonce');
					if (annonce) {
						annonce.textContent = textes('erreur', 'Le chargement a échoué. Merci de réessayer.');
					}
				});
		});
	}

	/* ---------- Masquer le CTA mobile à l'approche de la clôture ---------- */

	var cta = document.querySelector('.ld-cta-mobile');
	var cloture = document.querySelector('.ld-cloture');

	if (cta && cloture && 'IntersectionObserver' in window) {
		var observateur = new IntersectionObserver(function (entrees) {
			entrees.forEach(function (entree) {
				cta.hidden = entree.isIntersecting || (dialogue && dialogue.open);
			});
		});

		observateur.observe(cloture);
	}
})();
