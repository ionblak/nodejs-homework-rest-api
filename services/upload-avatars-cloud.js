const fs = require('fs/promises')

class Upload {
  constructor(uploadCloud) {
    this.uploadCloud = uploadCloud
  }

  async saveAvatarToCloud (pathFile, userIdImg) {
    const { public_id: publicId, secure_url: secureUrl } = await this.uploadCloud(pathFile, {
      public_id: userIdImg?.replace('Photos/', ''),
      folder: 'Photos',
      transformation: { widts: 250, crop: 'pad' }
    })

    await this.deleteTemporyFile(pathFile)
    return {
      userIdImg: publicId,
      avatarUrl: secureUrl,
    }
  }

  async deleteTemporyFile (pathFile) {
    try {
      await fs.unlink(pathFile)
    } catch (err) {
      console.log(err.message)
    }
  }
}

module.exports = Upload
