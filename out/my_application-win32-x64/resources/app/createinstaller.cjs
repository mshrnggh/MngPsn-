const { createWindowsInstaller } = require('electron-winstaller');

const options = {
  appDirectory: './out/my-application-win32-x64',
  outputDirectory: './out/installer',
  authors: 'Masahiro Noguchi',
  exe: 'my_application.exe',
  setupExe: 'MyApplicationSetup.exe',
  setupIcon: './path/to/setup-icon.ico'
};

createWindowsInstaller(options)
  .then(() => console.log('MSI installer created successfully'))
  .catch((error) => console.error(error.message));