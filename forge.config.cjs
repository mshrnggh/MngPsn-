module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'mshrnggh',
          name: 'Bulletine-Board-app.-published'
        },
        prerelease: false,
        draft: true,
        authToken: process.env.GITHUB_TOKEN
      }
    }
  ]
}