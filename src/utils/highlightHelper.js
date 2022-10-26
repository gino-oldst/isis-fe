export const customWordHighlightLogic = ({
    autoEscape,
    caseSensitive,
    sanitize,
    searchWords,
    textToHighlight
}) => {
    const chunks = [];
    const textLow = textToHighlight.toLowerCase();

    // Match at the beginning of each new word
    searchWords.forEach((sw) => {
        const regex = new RegExp(`(?<![\\w\\d])${sw}(?![\\w\\d])`, 'gmi');

        let match;

        while ((match = regex.exec(textLow))) {
            const start = match.index;
            const end = match.index + sw.length;

            chunks.push({
                start,
                end
            });

            // Prevent browsers like Firefox from getting stuck in an infinite loop
            // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }
    });

    return chunks;
};

// function defaultSanitize(string: string): string {
//     return string;
// }

// function escapeRegExpFn(string: string): string {
//     return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
// }
