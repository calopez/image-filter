import fs from 'fs';
import Jimp = require('jimp');
import { Response as GotResponse } from 'got'
import got from 'got';

export interface ImageMeta {
  contentType: string;
  found: boolean;
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

// TODO: use the image response as parameter in filterImageFromURL Jimp.read
// instead of the inputURL
export async function doesImageExist(inputURL: string): Promise<ImageMeta>{
  let result: ImageMeta = { found: true, contentType: '' };
    try {
      const response: GotResponse = await got(inputURL);
      const contentType: string = response.headers['content-type'] || '';
      if (contentType.match(/image/)) result.contentType = contentType;
    } catch (error) {
      result.found = false;
    }
  return result;
}
