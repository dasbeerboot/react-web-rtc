# React WebRTC with TypeScript example by Juwon Chun

---

## How to start?

1. Clone this repo
2. On your terminal, execute `yarn`
3. Then as always, go `yarn start`
4. Add new tab on your terminal, and repeat 2nd, 3rds step to open this app on different port

✔ Note that WebRTC only works with https and local environment

<br/><br/><br/>

### WebRTC =>

third-party 서버나 native앱 없이 유저들끼리 브라우저상에서 P2P connection을 이용해 다이렉트로 비디오, 오디오, 챗 등을 주고받을 수 있게 해주는 API.

### How does it work?

player 1이 다른 유저에게 player1로 connect 할 수 있는 오퍼를 create 한다. sdp object or sdp protocol needed. (sdp answer) , signaling. 시그널링 서버가 있어야되는데 시그널링 서버는 유저들끼리 안전하게 연결하도록 도와주지만 유저들 사이에서 전송되고 공유도ㅣ는 미디어는 건드리지 않는다. 하지만? 대부분의 유저들의 컴퓨터엔 방화벽(fire wall)이 깔려있고, ip주소는 계속해서 바뀐다. 그래서 네트워킹 관점에서 봤을때 webRTC는 어려운데, interactive connectivity 라고 불리우는 스탠다드로 (ice) 그들의 공개적인 아이피 어드레스를 고정시켜주는 스탠다드. 그거 써서 플레이어1과 2는 각자 ice candidates(ip address & port) 리스트를 만든다.
stun서버로 리퀘스트를 보내면 (구글거 공짜임) 데이터베이스에 모든 참여자가 읽을 수 있는 ice candidates를 저장하고 stun 서버의 알고리즘이 어떤 candidate가 제일 효율적인지 계산해서 연결을 주선해준다.

### How did I make this app?

1.  firebase를 인스톨한다. firebase는 우리가 백엔드 시그널링 서버로 사용할 수 있는 firestore database를 가지고있는 패키지다. 파이어베이스는
    데이터 베이스 업데이트를 리얼타임으로 보면서 작업하기 쉬워서 웹소켓같은거 안쓰고 파이어베이스 쓰겠다.

    ` yarn add firebase` 해서 인스톨 ㄱ ㄱ

2.  파이어베이스 콘솔로 가서, start in test mode로 파이어스토어를 이니셜라이즈해라
3.  setting 패널로 가서 </> 눌러서 웹프로젝트를 create하고 cdn으로 config을 받아야됨. 세팅할때 cdn밖에 안나온다고? 당황X  
    일단 set up하고 나면 화면이 뜸. 거기가서 config선택해서 받으면 됨
4.  이제 main.js로 가서 import 갈기고 firebase config을 붙여넣기하자
5.  이제 컴포넌트들 사이에서 공유될 세개의 글로벌 variable을 선언해야됨  
    ` let pc = new RICPeerConnection();`

### 🤩 헐 주원이가 해냈다!! 🤩

### 일단 해냈으니깐 목요일을 조금 즐기고 코드 리팩토링도 하고 README는 내일 고칠예정 ^~^ MUYAHO~~~
