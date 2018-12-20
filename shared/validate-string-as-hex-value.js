// @flow
export default (hex: string): ?string => {
  if (!hex) return null;
  if (hex.length < 3) return null;

  hex = hex.replace('#', '');

  if (hex.length === 3) {
    // ffo => ffff00
    hex = hex
      .split('')
      .map(i => `${i}${i}`)
      .join('');
  }

  hex = `#${hex}`;

  // https://stackoverflow.com/a/8027444
  const isOk = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  if (!isOk) return null;
  return hex;
};
