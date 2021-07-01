const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFileHelper = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {


    return new Promise((resolve, reject) => {

        const { file } = files;
        const nameSplitted = file.name.split('.');
        const fileExt = nameSplitted[nameSplitted.length - 1]

        if (!validExtensions.includes(fileExt)) {
            return reject(`La extension ${fileExt} no es permitida, ${validExtensions}`);
        }

        const tempName = uuidv4() + '.' + fileExt;


        const uploadPath = path.join(__dirname, '../uploads', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject({ msg: 'Ocurrió un error al subir un archivo', err });
            }
            resolve(tempName);
        });


    })

}

module.exports = {
    uploadFileHelper
};