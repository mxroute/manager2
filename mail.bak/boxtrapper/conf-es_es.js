//~~GENERATED~~
//-------------------------------------------------------------
// Source:    /usr/local/cpanel/base/frontend/paper_lantern/mail/boxtrapper/conf.js
// Generated: /usr/local/cpanel/base/frontend/paper_lantern/mail/boxtrapper/conf-es_es.js
// Module:    /paper_lantern/mail/boxtrapper/conf-es_es
// Locale:    es_es
// This file is generated by the cpanel localization system
// using the bin/_build_translated_js_hash_files.pl script.
//-------------------------------------------------------------
// !!! Do not hand edit this file !!!
//-------------------------------------------------------------
(function() {
    // The raw lexicon.
    var newLex = {"Minimum [asis,Apache] [asis,SpamAssassin] Spam Score required to bypass [asis,BoxTrapper]:":"Mínima puntuación de correo no deseado [asis,Apache] [asis,SpamAssassin] requerida para omitir [asis,BoxTrapper]:","The minimum spam score must be numeric.":"La puntuación de spam mínima debe ser numérica.","The number of days that you wish to keep logs and messages in the queue.":"El número de días que desea conservar los registros y los mensajes en la cola.","The number of days to keep logs must be a positive integer.":"El número de días para conservar los registros debe ser un entero positivo."};

    if (!this.LEXICON) {
        this.LEXICON = {};
    }

    for(var item in newLex) {
        if(newLex.hasOwnProperty(item)) {
            var value = newLex[item];
            if (typeof(value) === "string" && value !== "") {
                // Only add it if there is a value.
                this.LEXICON[item] = value;
            }
        }
    }
})();
//~~END-GENERATED~~
