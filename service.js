const cron = require("node-cron")
let logger = require('./routes/logger')
let sftp = require('./routes/sftp')

global.__basedir = __dirname;

class LabResultManager {
  static run(){
      //Download Files
      sftp.downloadHl7Files();
      //Parse Files
          //Save to database
  }
}

const task = cron.schedule("*/1 * * * *", () => {
  LabResultManager.run()
})

task.start()
