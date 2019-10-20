const cron = require("node-cron")
let logger = require("./routes/logger")
let sftp = require("./routes/sftp")
let hl7=require('./routes/hl7')
let db=require('./routes/db')

global.__basedir = __dirname

class LabResultManager {
  static run() {
    //Download Files to local folder
    sftp.downloadHl7Files()
    .then((files)=>{
      files.reduce((previousPromise, file) => {
        return previousPromise.then(() => {
             hl7.parseHl7File(file)
            .then((hl7Obj)=>{
               return db.saveToDB(hl7Obj);
            })
        });
      }, Promise.resolve())
    })
  }
}

LabResultManager.run()

// const task = cron.schedule("*/1 * * * *", () => {
//   LabResultManager.run()
// })

// task.start()
