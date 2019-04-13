module.exports = (...args) => {
  console.error('\n🚨 Error:', args[0], '🚨\n\n', ...args.slice(1), '\n');
  process.exit(1);
  return;
};
