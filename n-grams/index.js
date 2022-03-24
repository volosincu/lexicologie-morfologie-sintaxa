const fs = require('fs')

const TEXT_SAMPLE = fs.readFileSync('./latina_Tacitus.txt', 'utf8')
console.log(" >>>  Citire fisier ./latina_Tacitus.txt")
const TEXT_SAMPLE_PROPS = TEXT_SAMPLE.split(".");

// Parse text into propositions. Split by . and ? 
const _data = TEXT_SAMPLE_PROPS.map(p => {
    let h = p.split('?')
    return h.map(pp => {
        if (pp.trim().length > 0) {
            return "<s> " + pp.trim() + " <e>";
        } else {
            return '';
        }
    });
});
const data = [].concat(..._data);
const wordpAppearences = {};

function computePropositionMLE(prop) {
    const mleProbalitiesBigramTable = prop.split(" ").reduce((acc, w_n, i) => {
        if (!acc.nmin1) {
            acc.nmin1 = w_n;
            return acc;
        }
        // Word in n and n-1 index
        const w_pair = `${acc.nmin1} ${w_n}`
        let counts_w_nmin1 = wordpAppearences[acc.nmin1];
        let counts_w_pair = wordpAppearences[w_pair];

        if (!counts_w_nmin1) {
            counts_w_nmin1 = getWordApparitions(acc.nmin1);
            wordpAppearences[acc.nmin1] = counts_w_nmin1;
        }
        if (!counts_w_pair) {
            counts_w_pair = getWordApparitions(w_pair, true);
            wordpAppearences[w_pair] = counts_w_pair;
        }
        const w_nmin1_count__w_n_count = wordpAppearences[w_pair];
        const w_nmin1_c = wordpAppearences[acc.nmin1];
        // Maximum Likelihood Estimate
        let MLE = w_nmin1_count__w_n_count / w_nmin1_c;
        if (Number.isNaN(MLE)) {
            MLE = 0.;
        }

        acc.mle.push({ pair: `${acc.nmin1} ${w_n}`, prob: MLE, ratio: w_nmin1_count__w_n_count + '/' + w_nmin1_c });
        acc.nmin1 = w_n;
        return acc;

    }, { mle: [] });

    return mleProbalitiesBigramTable;
}

/**
 * @description compute the Maximum Likelihood Estimate for propositions bigrams
 * @returns {Array} a list with objects that have the bigram, probability and ratio
 */
function collectBiGramsAndComputeMLEOnTrainingData() {
    let mleprobs = [];
    data.forEach(prop => {
        const mleProbalitiesBigram = computePropositionMLE(prop);
        mleprobs = [...mleprobs, ...mleProbalitiesBigram.mle];
    });
    return mleprobs;
}

/**
 * 
 * @param {*} word 
 * @param {*} searchPair 
 * @returns the count of word appearences in the text
 */
function getWordApparitions(word, searchPair) {

    if (searchPair) {
        return data.reduce((count, prop) => {
            let c = 0;
            try {
                c = (prop.match(new RegExp(`${word}`, 'g')) || []).length
            } catch (e) {
                console.error("ERROR for : " + word)
            }
            return count + c;
        }, 0);
    }


    return data.reduce((count, prop) => {
        let words = prop.split(" ");

        words.forEach((w) => {
            if (w.includes(word.toLowerCase())) {
                count += 1;
            }
        });
        return count;
    }, 0)
}

function sentenceProb(sentenceProbabilityTable, uniqueOccurences, VocabularySize){
    return sentenceProbabilityTable.mle.reduce((product, bigram) => {
            if (bigram.prob == 1) {
                product = (1 / uniqueOccurences) * product;
            } if (bigram.prob == 0) {
                product = (1 / VocabularySize) * product;
            }
            else {
                product = bigram.prob * product;
            }

            return product;
        }, 1);
}

function main() {
    console.log(" >>>  Computing probabilities table ...")

    const traningTextBigramTable = collectBiGramsAndComputeMLEOnTrainingData();
    console.log(traningTextBigramTable);
    console.log(" >>>  Count 0 occurences for smoothing ...")
    const zeroOccurences = traningTextBigramTable.reduce((occ, bigram) => {
        if (bigram.prob == 1) {
            occ += 1;
        }
        return occ;
    }, 0);
    console.log(" >>>>  Unique occurences: ", zeroOccurences);

    // TRANING AND SAMPLE TEXT SOURCE : https://www.thelatinlibrary.com/tac.html
    const randomSample = "non obscuris, ut antea, matris artibus, sed palam hortatu. nam senem Augustum devinxerat adeo";
    const randomSample1 = "parum in tempore incipientis principis curas onerari";


    const sentenceProbabilityTable = computePropositionMLE(`<s> ${randomSample} </e>`);
    const sentenceProbabilityTable1 = computePropositionMLE(`<s> ${randomSample1} </e>`);

    console.log("\n >>>  New sentence bigram probabilities ...\n")
    console.log(sentenceProbabilityTable.mle);
    

    const VocabularySize = Object.keys(wordpAppearences).length / 2;

    // reduce Perplexity - use Witten-Bell smoothing method
    

    const sentenceProbability = sentenceProb(sentenceProbabilityTable, zeroOccurences, VocabularySize);
    const sentenceProbability1 = sentenceProb(sentenceProbabilityTable1, zeroOccurences, VocabularySize);   

    console.log("\n  >>>>  Sentence probability: ", sentenceProbability);

    console.log("\n >>>  New sentence bigram probabilities ...\n")
    console.log(sentenceProbabilityTable.mle);

    console.log("\n  >>>>  Sentence probability: ",sentenceProbability1);
}
main();
