let Client = require("ssh2-sftp-client")
let sftp = new Client()
let hl7 = require("./hl7")

require("dotenv").config()

exports.downloadHl7Files = () => {
  console.log("connecting to sftp")
  sftp
    .connect({
      host: process.env.AEGIS_HOST,
      port: process.env.AEGIS_PORT,
      username: process.env.AEGIS_USERNAME,
      password: process.env.AEGIS_PASSWORD
    })
    .then(() => {
      console.log("connection established")
      return sftp.list(process.env.AEGIS_REMOTE_PATH)
    })
    .then(files => {
      var downloads = []
      files.forEach(file => {
        const remoteFilename = process.env.AEGIS_REMOTE_PATH + file.name
        const localFilename = __basedir + "/files/" + file.name
        downloads.push(sftp.get(remoteFilename, localFilename))
      })

      Promise.all(downloads)
        .then(() => {
          logger.log({
            level: "info",
            message: "downloads completed"
          })
          sftp.end()
        })
        .then(() => {
          hl7.parseHl7Files()
        })
        .catch(() => {
          logger.log({
            level: "error",
            message: "Error downloading files"
          })
          sftp.end()
        })
    })
    .catch(err => {
      throw new Error(
        "Unable to download files from AGEIS: " + JSON.stringify(err)
      )
    })
}
