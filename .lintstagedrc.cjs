module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => {
    const commands = [];

    // Only run eslint if it's installed
    try {
      require.resolve('eslint');
      commands.push(`eslint --fix ${filenames.join(' ')}`);
    } catch (e) {
      console.warn('⚠️  ESLint not found, skipping...');
    }

    // Only run prettier if it's installed
    try {
      require.resolve('prettier');
      commands.push(`prettier --write ${filenames.join(' ')}`);
    } catch (e) {
      console.warn('⚠️  Prettier not found, skipping...');
    }

    return commands;
  },
  '*.{json,md,yml,yaml,css,scss}': (filenames) => {
    // Only run prettier if it's installed
    try {
      require.resolve('prettier');
      return `prettier --write ${filenames.join(' ')}`;
    } catch (e) {
      console.warn('⚠️  Prettier not found, skipping...');
      return [];
    }
  },
};
