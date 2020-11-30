import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import { ProcessingManager } from 'react-native-video-processing';
export default class VideoProcessor{
compressVideo= async (videoSource)=>{
  console.log(videoSource)
return new Promise((resolve,reject)=>{
        const options = {
            width: '100%',
            height:'100%',
            bitrateMultiplier: 3,
            saveToCameraRoll: true, // default is false, iOS only
            saveWithCurrentDate: true, // default is false, iOS only
            minimumBitrate: 300000,
            removeAudio: true, // default is false
        };
ProcessingManager.compress(videoSource, options).then((data) =>{// like VideoPlayer compress options
  resolve(data.source)
console.log('lkdsjklfjlkjsdklfj,',data.source)}).catch((err)=>{reject(err,'fuck')})
})
          }
}
