const {NODE_TYPES, MAIN_TYPE,} = require("./types")

module.exports = {
    isEmail: function (word) {
        var re = /\S+@\S+\.\S+/;
        return re.test(word);
    },

    isIP: function (word) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(word)) {
            return (true)
        }
        return false;
    },

    isUrl: function (word) {
        try {
            return Boolean(new URL(word));
        }
        catch (e) {
            return false;
        }
    },

    isSign: function (word) {
        if (word && word.length > 1) {
            return;
        }
        return [",", ".", ";", "!", "?", "(", ")", "[", "]"].includes(word);
    },

    isNoun: function (word) {
        return "abcdefghijklmnopqrstyxz".toUpperCase().split("").includes(word.charAt(0));
    },

    isProperNoun: function (tokenIndex) {
        // acceseaza|cauta token anterior si verifica dupa dl. dna. domnul doamna domnisoara 
        return;
    },

    isWordType: function (type) {
        return type === MAIN_TYPE.WORD;
    }

}