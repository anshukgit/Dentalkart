export const snakeToTitleCase = (
  s: string = '',
  searchString = '',
  replaceString = '',
) => {
  const str = s.replace(/^_*(.)|_+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : ' ' + d.toUpperCase(),
  );

  if (!!searchString && !!replaceString) {
    return str.replace(searchString, replaceString);
  } else {
    return str;
  }
};
