//~~GENERATED~~
//-------------------------------------------------------------
// Source:    /usr/local/cpanel/base/frontend/paper_lantern/mail/boxtrapper/conf.js
// Generated: /usr/local/cpanel/base/frontend/paper_lantern/mail/boxtrapper/conf-ru.js
// Module:    /paper_lantern/mail/boxtrapper/conf-ru
// Locale:    ru
// This file is generated by the cpanel localization system
// using the bin/_build_translated_js_hash_files.pl script.
//-------------------------------------------------------------
// !!! Do not hand edit this file !!!
//-------------------------------------------------------------
(function() {
    // The raw lexicon.
    var newLex = {"Minimum [asis,Apache] [asis,SpamAssassin] Spam Score required to bypass [asis,BoxTrapper]:":"Для обхода [asis,BoxTrapper] требуется минимальное значение оценки нежелательной почты приложением [asis,Apache] [asis,SpamAssassin]:","The minimum spam score must be numeric.":"Минимальный рейтинг нежелательной почты должен быть числом.","The number of days that you wish to keep logs and messages in the queue.":"Срок хранения сообщений электронной почты и сообщений в очереди в днях.","The number of days to keep logs must be a positive integer.":"Количество дней хранения журналов должно выражаться положительным целым числом."};

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
