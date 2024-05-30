const Filter = require('bad-words');
const DOMPurify = require('dompurify');

const filter = new Filter();

const moderateText = (text) => {
  return filter.clean(text);
};

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

module.exports = { moderateText, sanitizeInput };