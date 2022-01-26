# 원티드랩 - 서버개발자(NodeJS) 사전테스트
## 1. Dependency
### NodeJS
- ver 16.13.2
### Node_Modules
- express : v4.16.1
- ejs : v2.6.1
- sqlite3 : 5.0.2

## 2. Database
### Info
- SQLite 사용
### structure
#### board
- idx : 게시글의 index number(primary key)
- subject : 제목
- context : 내용
- name : 작성자 이름
- password : 비밀번호
- reg_ts : 작성일시
- edit_ts : 수정일시
#### reply
- idx : 댓글의 index number(primary key)
- board_idx : 게시글의 index number(foreign key)
- context : 내용
- name : 작성자
- reg_ts : 작성일시
#### rereply
- reply_idx : 댓글의 index number(foreign key)
- context : 내용
- name : 작성자
- reg_ts : 작성일시
#### keyword
- name : 작성자 이름
- keyword : 등록한 키워드
#### alert
- name : 알람을 보낼 사람의 이름
- keyword : 등록한 키워드
- subject : 등록한 키워드가 작성된 게시글의 제목
### 배포
- 요구사항 중 "DB 스키마 생성 스크립트"는 app.js에 포함시켜, 프로젝트를 실행하면 자동으로 생성되게끔 구현하였음

## 3. API
### 리스트
- [POST]    /api/board/list     : 게시글 리스트를 획득(Pagination 적용)
- [POST]    /api/board/search   : 제목, 작성자로 검색한 게시글 리스트 획득
- [POST]    /api/board/read     : 게시글(제목, 작성자, 내용 등) 정보 획득
- [PUT]     /api/board/write    : 게시글 작성 (알림 메세지를 등록하는 logic 포함)
- [PUT]     /api/board/update   : 게시글 수정 (알림 메세지를 등록하는 logic 포함)
- [DELETE]  /api/board/delete   : 게시글 삭제 (연동되어 있는 댓글, 대댓글도 같이 삭제)
- [POST]    /api/board/auth     : 게시글 수정,삭제시 사용된 비밀번호에 대한 검증
- [POST]    /api/reply/list     : 댓글 리스트 획득(Pagination 적용)
- [PUT]     /api/reply/write    : 댓글 작성
- [POST]    /api/rereply/list   : 대댓글 리스트 획득
- [PUT]     /api/rereply/write  : 대댓글 작성
- [POST]    /api/alert/list     : 알람 내용 확인
### 핵심로직
#### Pagination
- 비동기식 처리를 동기식으로 변경하여 전체 리스트의 갯수 획득, 리스트 정보 획득을 순차적으로 진행한뒤 response를 보낼 수 있게끔 함
- Parmeter로 받은 page를 기준으로 Limit 쿼리를 이용해 10개씩 리스트를 전달 할 수 있게끔 구현
#### Alert
- 글이 작성되거나, 수정될 경우 해당 Logic이 실행됨
- 현재 등록된 모든 Keyword 리스트를 획득하고, 작성 또는 수정시 받아오는 Context(내용) Parameter에 keyword가 존재하는지 확인함
- 현재 등록된 keyword를 기준으로 하기 때문에, keyword가 등록된 이후에 alert을 받을 수 있음(이전 내용으로는 받을 수 없음)
- 만약 keyword가 발견된다면 alert table에 data를 insert하여 알림을 받을 수 있게끔 구현

## 4. Front-end 및 기능구현
### 게시글 리스트(index.html)
- 게시글 리스트 : 게시글 리스트, 게시글 중 하나를 클릭하면 조회 할 수 있음 
- 검색 : 제목, 작성자로 게시글 검색
- 글쓰기 : 게시글 작성
- 알람확인하기 : 알람 확인
- 이전/다음 : 페이지 이동

#### 게시글
- 게시글의 유형은 조회(read), 작성(write), 수정(edit)으로 총 3개인데, 각각 구현하지 않고 각각의 기능별로 요소들을 보이기/숨기기 처리하여 구현
- 조회에서는 제목, 내용, 댓글 등의 기능을 조회/사용 할 수 있으며, 수정이력이 없으면(edit_ts=null) 작성일을, 있다면 최종 수정이력을 노출 하게끔 구현
- 작성에서는 제목, 내용, 이름, 패스워드등을 쓸 수 있고 댓글 쓰기/읽기 등의 기능은 사용할 수 없음
- 수정에서는 이전에 입력했던 내용들을 불러와 수정 할 수 있게끔 구현했으며, 쓰기와 마찬가지로 댓글 쓰기/읽기 등의 기능은 사용 할 수 없음
- 댓글의 내용을 클릭하면 대댓글을 달 수 있음

## 5. 사용법
- "npm install" : Dependency 패키지 설치
- "npm start" : Application 실행
- http://localhost:3000

## 6. ToDo
### 예외처리
- Front-end쪽에서 모든 Parmeter를 반드시 전달한다는 가정하에 작성된 API들이 많다.
- 필수 Parmeter를 정의하고, Front-end의 잘못된 통신에도 안정적으로 구동할 수 있는 API 설계가 필요할 것 같다.
### DB 트랜젝션
- 단일 사용자가 아닌 여러 사용자가 사용한다고 가정했을 때, 수정 삭제등에 대한 트랜잭션이 완벽하다고 보기 어렵다.
- 해당 부분에 대한 DB 트랜잭션 Logic을 다시 설계할 필요가 있다.
### Alert기능
- 많은 사용자들이 게시글을 작성,수정 한다고 가정한다면, 서버에 부하가 걸릴 수 있다.
- 다수의 사용자를 위해서 queue를 구축하고, alert 생성을 순차적으로 진행한다면 보다 안정적으로 동작할 수 있을 것 같다.