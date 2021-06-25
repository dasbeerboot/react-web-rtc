import React, { useState, useEffect, useRef } from 'react'
import './App.css';
import logo from './logo.svg';
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDpLbGo4YhYPfVE5iY49lDhN88Tx3LUvs8",
  authDomain: "react-web-rtc.firebaseapp.com",
  databaseURL: "https://react-web-rtc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-web-rtc",
  storageBucket: "react-web-rtc.appspot.com",
  messagingSenderId: "340688411698",
  appId: "1:340688411698:web:25e56d0a6d38412084702b",
  measurementId: "G-W5LNPQ6KHN"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

// Global State
let pc = new RTCPeerConnection(servers); // 이 object 는 where all the actions happen
let localStream;
let remoteStream;

function App() {
  // const localStream = useRef(null)
  let webcamButton = document.getElementById('webcamButton');
  let webcamVideo = document.getElementById('webcamVideo');
  let callButton = document.getElementById('callButton');
  let callInput = document.getElementById('callInput');
  let answerButton = document.getElementById('answerButton');
  let remoteVideo = document.getElementById('remoteVideo');
  let hangupButton = document.getElementById('hangupButton');

  // const remoteStream = useRef(null)

  const [callId, setCallId] = useState('')
  // 1. 미디어 소스 셋업
  const onClickWebcamButton = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    remoteStream = new MediaStream()
    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });



    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    callButton.disabled = false;
    answerButton.disabled = false;
    webcamButton.disabled = true;
  }

  // 2. offer 만들기
  const onClickCallButton = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection('calls').doc()
    let offerCandidates = callDoc.collection('offerCandidates')
    let answerCandidates = callDoc.collection('answerCandidates')

    const getTemp = () => {
      offerCandidates = callDoc.collection('offerCandidates')
      answerCandidates = callDoc.collection('answerCandidates')
      setCallId(callDoc.id)
    }

    pc.onicecandidate = async (event) => {
      await getTemp()
      event.candidate && offerCandidates.add(event.candidate.toJSON())

    };

    callInput.value = callId

    // Get candidates for caller, save to db
    await pc.onicecandidate(offerCandidates)

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    }

    await callDoc.set({ offer })

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data()
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer)
        pc.setRemoteDescription(answerDescription)
      }
    })

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.addIceCandidate(candidate)
        }
      })
    })

  }

  // 3. Answer the call with the unique ID
  const onClickAnswerButton = async () => {
    const callDoc = firestore.collection('calls').doc(callInput.value)
    const answerCandidates = callDoc.collection('answerCandidates')
    const offerCandidates = callDoc.collection('offerCandidates')

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    }

    const callData = (await callDoc.get()).data()

    const offerDescription = callData.offer
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription))

    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    }

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change)
        if (change.type === 'added') {
          let data = change.doc.data()
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      })
    })
  }

  const getElementsWhenRendered = () => {
    webcamButton = document.getElementById('webcamButton');
    webcamVideo = document.getElementById('webcamVideo');
    callButton = document.getElementById('callButton');
    callInput = document.getElementById('callInput');
    answerButton = document.getElementById('answerButton');
    remoteVideo = document.getElementById('remoteVideo');
    hangupButton = document.getElementById('hangupButton');
  }

  useEffect(() => {
    getElementsWhenRendered()
  })

  return (
    <div className="App">
      <h2>1. Start your Webcam</h2>

      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video id="webcamVideo" autoPlay playsInline></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video id="remoteVideo" autoPlay playsInline></video>
        </span>
      </div>

      <button id="webcamButton" onClick={onClickWebcamButton}>Start webcam</button>
      <h2>2. Create a new Call</h2>
      <button id="callButton" onClick={onClickCallButton}>Create Call (offer)</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>

      <input id="callInput"></input>
      <button id="answerButton" onClick={onClickAnswerButton}>Answer</button>

      <h2>4. Hangup</h2>

      <button id="hangupButton">Hangup</button>
    </div>
  );
}

export default App;
