const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/video/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/video/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/video/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/video/models'),
  // faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}



video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    // const labeledFaceDescriptors = await loadLabeledImages()
    // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    // const detections1 = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    // const resizedDetections1 = faceapi.resizeResults(detections1, displaySize)
    // const results = resizedDetections1.map(d => faceMatcher.findBestMatch(d.descriptor))
    // results.forEach((result, i) => {
    //   const box = resizedDetections1[i].detection.box
    //   const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    //   drawBox.draw(canvas)
    // })

  }, 100)
})



// function loadLabeledImages() {
//   const labels = ['Student','Lecturer', 'Security', 'Stranger']
//   return Promise.all(
//     labels.map(async label => {
//       const descriptions = []
//       for (let i = 1; i <= 2; i++) {
//         const img = await faceapi.fetchImage(`https://priceless-banach-9fd88b.netlify.app/labeled_images/${label}/${i}.jpg`)
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         descriptions.push(detections.descriptor)
//       }

//       return new faceapi.LabeledFaceDescriptors(label, descriptions)
//     })
//   )
// }