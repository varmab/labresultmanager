let Client = require("ssh2-sftp-client")
let sftp = new Client()

require("dotenv").config()

exports.downloadHl7Files = () => {
  return new Promise((resolve, reject) => {
    logger.log({ level: "info", message: "connecting to sftp" })
    sftp
      .connect({
        host: process.env.AEGIS_HOST,
        port: process.env.AEGIS_PORT,
        username: process.env.AEGIS_USERNAME,
        password: process.env.AEGIS_PASSWORD
      })
      .then(() => {
        logger.log({ level: "info", message: "sftp connection established" })
        return sftp.list(process.env.AEGIS_REMOTE_PATH)
      })
      .then(files => {
        if (files.length > 0) {
          var downloads = []
          var localFiles = []
          files.forEach(file => {
            const remoteFilename = process.env.AEGIS_REMOTE_PATH + file.name
            const localFilename = __basedir + "/files/" + file.name
            localFiles.push(localFilename)
            downloads.push(sftp.get(remoteFilename, localFilename))
          })
          Promise.all(downloads)
            .then(() => {
              var filesToDelete = []
              files.forEach(file => {
                const remoteFilename = process.env.AEGIS_REMOTE_PATH + file.name
                filesToDelete.push(sftp.delete(remoteFilename))
              })

              Promise.all(filesToDelete).then(() => {
                sftp.end()
                logger.log({
                  level: "info",
                  message: "completed downloading files"
                })
                resolve(localFiles)
              })
            })
            .catch(err => {
              sftp.end()
              let errorMessage =
                "Failed to finish downloading:" + JSON.stringify(err)
              logger.log({ level: "error", message: errorMessage })
              let error = new Error(errorMessage)
              reject(error)
            })
        }
      })
      .catch(err => {
        logger.log({
          level: "info",
          message: "There are no files available on server",
          err
        })
      })
  })
}
