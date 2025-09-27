import './cookie-consent.umd.js';

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
    // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
    guiOptions: {
        consentModal: {
            layout: 'box wide',
            position: 'bottom right',
            equalWeightButtons: true,
            flipButtons: false,
        },
        preferencesModal: {
            layout: 'box',
            equalWeightButtons: true,
            flipButtons: false,
        },
    },

    onConsent: ({ cookie }) => {
        // console.log("onConsent fired!", cookie)
        handleConsentChange();
    },

    onChange: ({ changedCategories, changedServices }) => {
        // console.log("onChange fired!", changedCategories, changedServices)
        handleConsentChange();
    },

    categories: {
        necessary: {
            enabled: true, // this category is enabled by default
            readOnly: true, // this category cannot be disabled
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^_ga/, // regex: match all cookies starting with '_ga'
                    },
                    {
                        name: '_gid', // string: exact cookie name
                    },
                ],
            },
        },
        social: {},
    },

    language: {
        default: 'cs',
        translations: {
            cs: {
                consentModal: {
                    title: 'Tato webová stránka používá cookies',
                    description:
                        'Tyto webové stránky používají k poskytování služeb a analýze návštěvnosti soubory cookies. Některé z nich jsou k fungování stránky nezbytné, ale o některých můžete rozhodnout sami. Můžete je povolit všechny, jednotlivě vybrat nebo všechny odmítnout.',
                    acceptAllBtn: 'Přijmout vše',
                    acceptNecessaryBtn: 'Pouze nezbytné',
                    showPreferencesBtn: 'Nastavení cookies',
                },
                preferencesModal: {
                    title: 'Nastavení cookies',
                    acceptAllBtn: 'Přijmout vše',
                    acceptNecessaryBtn: 'Odmítnout vše',
                    savePreferencesBtn: 'Uložit moje volby',
                    closeIconLabel: 'Zavřít',
                    // serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: 'Používaní cookies',
                            description:
                                'Tyto webové stránky používají k poskytování služeb a analýze návštěvnosti soubory cookies. Některé z nich jsou k fungování stránky nezbytné, ale o některých můžete rozhodnout sami.',
                        },
                        {
                            title: 'Funkční cookies – vždy povoleno',
                            description: 'Tyto soubory cookie jsou nutné pro základní funkce stránky, a jsou proto vždy povolené.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary',
                        },
                        {
                            title: 'Statistické cookies',
                            description:
                                'Statistické cookies umožňují majitelům webových stránek sledovat návštěvnost webových stránek. Anonymně sbírají a sdělují informace, které pomáhají k vylepšování obsahu stránek.',
                            linkedCategory: 'analytics',
                        },
                        {
                            title: 'Sociální média',
                            description:
                                'Se souhlasem cookies sociálních médií se můžete připojit k vašim sociálním sítím a prostřednictvím nich sdílet obsah z naší webové stránky. Při vypnutí se nebude zobrazovat obsah ze sociálních sítí (Facebook, Instagram, Youtube a další).',
                            linkedCategory: 'social',
                        },
                    ],
                },
            },
        },
    },
});

function handleConsentChange() {
    /**
     * Set up iframe placeholder if "social" cookies are not enabled
     */
    if (CookieConsent.getCookie('categories') === undefined || !CookieConsent.getCookie('categories').includes('social')) {
        const iframePlaceholder = '/_cookie-consent-iframe.html';
        document.querySelectorAll('iframe[data-category="social"]').forEach((el) => {
            if (!el.dataset.src) {
                el.dataset.src = el.src;
                el.src = iframePlaceholder;
                return;
            }

            el.src = iframePlaceholder;
        });
    } else {
        /**
         * Social cookies are enabled, get value from data-src and set up src attribute
         */
        document.querySelectorAll('iframe[data-src][data-category="social"]').forEach((el) => {
            el.src = el.dataset.src;
            delete el.dataset.src;
        });
    }
}
// Fire handler if cookies not set up yet
if (CookieConsent.getCookie('categories' === undefined)) handleConsentChange();

// Listen for message from iframe placeholder
window.addEventListener(
    'message',
    (e) => {
        if (e.data === 'cc-settings') CookieConsent.showPreferences();
    },
    false
);
