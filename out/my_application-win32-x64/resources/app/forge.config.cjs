module.exports = {
  packagerConfig: {
    name: "my_application",
    executableName: "my_application",
    icon: "path/to/icon.ico",
    appBundleId: "com.example.my_application",
    win32metadata: {
      CompanyName: "My Company",
      ProductName: "My bulletine board Application",
      FileDescription: "My Application Description",
      OriginalFilename: "my_application.exe",
      InternalName: "my_application"
    }
  },
  makers: [   
    {
      name: "@electron-forge/maker-msi",
      config: {
        name: "my_application",
        icon: "path/to/icon.ico",
        setupIcon: "path/to/setup-icon.ico",
        loadingGif: "path/to/loading.gif"
      }
    },
     {
      name: "@electron-forge/maker-zip",
      platforms: ["win32"]
    }
  ]
};