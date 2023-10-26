module.exports = {
  packagerConfig: {
    name: "my_bulletine_board",
    executableName: "my_bulletine_board",
    appBundleId: "com.example.my_application",
    win32metadata: {
      CompanyName: "",
      Author: "Masahiro Noguchi",
      ProductName: "My bulletine board Application",
      FileDescription: "My Application Description",
      OriginalFilename: "Bulletine-board.exe",
      InternalName: "my_application" 
    },
    extraResource: [
      { from: "node_modules/uuid/dist/esm-browser",
        to: "node_modules/uuid/dist/esm-browser"}
    ]
  },


  makers: [   
     {
      name: "@electron-forge/maker-zip",
      platforms: ["win32"]
     }
  ]
};