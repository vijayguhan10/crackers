const cloudinary = require('cloudinary').v2;
const moment = require('moment');

cloudinary.config({
  cloud_name: 'dkro770eh',
  api_key: '588145723158891',
  api_secret: '2FVYifC8e3kwiNb_Ui96ZfEEfsc'
});

module.exports = cloudinary;

const uploadPDFToCloudinary = async (filePath, comapanyname, customername) => {
  try {
    const currentDateTime = moment().format('YYYY-MM-DD_HH-mm-ss'); // Format: 2024-12-23_15-30-45
    const customFileName = `${customername}_${currentDateTime}`;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: `${comapanyname}`,
      public_id: customFileName
    });

    console.log('File uploaded successfully:');
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = { uploadPDFToCloudinary };
