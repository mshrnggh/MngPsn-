const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
let Thread;
import('../mngSchema.mjs').then((module) => {
  Thread = module.Thread;
  console.log('Thread ', Thread);
});
const mongoose = require("mongoose");
let olocalButtonClicked = false
let wmngdbButtonClicked = false;
const {get_Conf_Data, registerToLocalDB, registerToMongoDB} = require('../mainProcess/postIPC.cjs');