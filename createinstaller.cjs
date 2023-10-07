const { createWindowsInstaller } = require('electron-winstaller');

const options = {
  appDirectory: './out/my_application-win32-x64',
  outputDirectory: './out/installer',
  authors: 'Masahiro Noguchi',
  exe: 'my_application.exe',
  setupExe: 'MyApplicationSetup.exe',
  title: "Bulletine Board Application",
  name: "my-application",
  description: "Bulletin board application",
  version: "1.0.0",
  type: "module",
  main: "main.cjs",
  scripts: {
    dev: "electron .",
    server: "node --experimental-modules server.cjs",
    start: "electron-forge start",
    package: "electron-forge package",
    make: "electron-forge make",
    publish: "electron-forge publish"
  },
  dependencies: {
    dotenv: "^10.0.0",
    express: "^4.18.2",
    mongodb: "^4.17.0",
    mongoose: "^7.3.2",
    nodemon: "^3.0.1"
  },
  devDependencies: {
    "@electron-forge/cli": "^6.2.1",
    "@electron-forge/publisher-github": "^6.4.2",
    "electron": "^25.8.4",
    "electron-installer-windows": "^3.0.0",
    "electron-winstaller": "^5.1.0"
  },
  volta: {
    node: "18.15.0"
  }
}

createWindowsInstaller(options)
  .then(() => console.log('MSI installer created successfully'))
  .catch((error) => console.error(error.message));