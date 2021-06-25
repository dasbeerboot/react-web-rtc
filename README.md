# React WebRTC with TypeScript example by Juwon Chun

---

## What is Web RTC?

Web RTC는 브라우저 상에서 사용자들끼리 Peer to Peer(P2P) 통신을 이용해 다이렉트로 비디오, 오디오, 챗 등을 주고받을 수 있게 해주는 API이다.

![pic1](./src/assets/webrtc1.png)  
기존 웹에서는 통신을 위해서 사용자들 사이에 중간 서버를 거치게 된다.

![pic2](./src/assets/webrtc2.png)  
WebRTC를 이용하면 중간 서버나 native 앱을 거치지 않고, P2P 통신을 이용해 미디어를 주고받을 수 있다.
<br /><br/>

### 중간서버를 거치지 않는다 !== 서버가 필요 없다.

여기서 중간 서버를 거치지 않는다는 말이 곧 서버가 필요 없음을 뜻하지는 않는다.  
Web RTC를 이용한 웹 어플리케이션 사용자의 관점에서는 브라우저 외에 아무것도 필요하지 않지만,  
Web RTC API는 시그널링을 수행하지 않기 때문에 개발자는 이를 위해 따로 동작하는 서버 측 솔루션을 만들어야 한다.

> **시그널링(Signaling)** : 미디어를 주고 받음에 있어서, Third-party 서버 없이 Peer to Peer로 통신할 수 있도록  
> 해당 통신 세션의 설정, 제어, 및 종료를 총괄하는 프로세스.

NAT환경에서 private IP를 할당받은 클라이언트가 WebRTC를 이용하고자 할 때, 사용자는 자신의 public IP를 필요로 한다.  
이를 위해 자신의 public IP를 파악하고 상대 peer에 데이터를 전송하기 위한 peer간의 응답 프로토콜인 Ice(Interactive Connectivity Establishment) 프로토콜을 이용하며 이 프로토콜은 STUN서버를 이용해 구축할 수 있다.  
예를 들어, 사용자1과 사용자2가 서로간의 P2P 커넥션을 위해 STUN서버로 리퀘스트를 보내면, 이 서버는 응답값으로 요청을 보낸 클라이언트의 public IP와 포트를 보내주고,  
동시에 연결된 데이터베이스에 모든 참여자가 읽을 수 있도록 저장한다.
이후 서버 알고리즘이 어떤 candidate와의 연결이 가장 효율적일지 계산 해 연결을 주선해준다.

> **STUN** : 방화벽이 설치된 NAT 환경에서 Ice 프로토콜 구축을 위해 사용하는 서버.

<br/><br/>

## How does it work?
