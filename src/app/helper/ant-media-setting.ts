export const antMediaSetting = {
    sdpConstraints : {
		OfferToReceiveAudio : false,
		OfferToReceiveVideo : false
    },
    mediaConstraints : {
        // video: {
        // width: { min: 640, ideal: 1280, max: 1920 },
        // height: { min: 480, ideal: 720, max: 1080 },
        // },
          video: true,
          audio : true
      }

}