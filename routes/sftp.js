
let Client = require("ssh2-sftp-client")
let sftp = new Client()

require("dotenv").config();

exports.downloadHl7Files=()=>{
    console.log(__basedir)
    sftp
      .connect({
        host: process.env.AEGIS_HOST,
        port: process.env.AEGIS_PORT,
        username: process.env.AEGIS_USERNAME,
        password: process.env.AEGIS_PASSWORD
      })
      .then(() => {
        return sftp.list(process.env.AEGIS_REMOTE_PATH)
      })
      .then(files => {
        var downloads=[];
        files.forEach((file)=>{
            const remoteFilename = process.env.AEGIS_REMOTE_PATH + data[i].name
            const localFilename = __basedir + "/files/" + data[i].name
            downloads.push(sftp.get(remoteFilename, localFilename));
        })

        Promise.all(downloads)
        .then(()=>{
          logger.log({
            level:"info",
            message:"downloads complete"
          })
          sftp.end();
        })
        .catch(()=>{
          logger.log({
            level:"error",
            message:"Error downloading files"
          })
          sftp.end();
        })

      })
      .catch(err => {
        throw new Error("Unable to download files from AGEIS: " + JSON.stringify(err))
      })
  }