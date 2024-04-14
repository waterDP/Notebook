/*
 * @Author: water.li
 * @Date: 2024-04-14 21:32:50
 * @Description:
 * @FilePath: \Notebook\WebRTC\.ts
 */

const videoDom: HTMLMediaElement = document.querySelector("#video")!;

const onSuccess = (stream) => {
  const videoTracks = stream.getVideoTracks();
  console.log("视频设备:", videoTracks[0].label);
  const audioTracks = stream.getAudioTracks();
  console.log("音频设备:", audioTracks[0].label);
  videoDom!.srcObject = stream;
};

const onError = (error) => console.log(error);

const constraints = {
  audio: true,
  video: true,
};

navigator.mediaDevices.getUserMedia(constraints).then(onSuccess).catch(onError);
