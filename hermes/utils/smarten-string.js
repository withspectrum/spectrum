// @flow
export default (string: string) => {
  string = string.replace(/(^|[-\u2014\s(\["])'/g, '$1\u2018'); // opening singles
  string = string.replace(/'/g, '\u2019'); // closing singles & apostrophes
  string = string.replace(/(^|[-\u2014/\[(\u2018\s])"/g, '$1\u201c'); // opening doubles
  string = string.replace(/"/g, '\u201d'); // closing doubles
  string = string.replace(/--/g, '\u2014'); // em-dashes
  return string;
};
