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
- index : 게시글의 index number(primary key)
- subject : 제목
- context : 내용
- name : 작성자 이름
- password : 비밀번호
- reg_ts : 작성일시
- edit_ts : 수정일시
#### reply
- index : 댓글의 index number(primary key)
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
- reg_word : 등록한 키워드

## 3. API

## 4. Front-end 및 기능구현
### 게시판 기능
#### 게시글 리스트
게시글 리스트는 글목록, 검색, 글쓰기, pagenation으로 구성된다.

#### 게시글
게시글의 유형은 조회(read), 작성(write), 수정(edit)으로 총 3개다. 각각의 유형은 아래와 같은 특성으로 구성할 예정이다.
| |제목|내용|작성자|비밀번호|작성일|수정일|댓글|
|---|---|---|---|---|---|---|---|
|조회 |read|read|read|hidden|read|read |read|
|작성 |write|write|write|write|hidden|hidden|hidden|
|수정 |write|write|read|hidden| hidden|hidden|hidden|

### 키워드 알람 기능

## 5. 사용법
- "npm install" : Dependency 패키지 설치
- "npm start" : Application 실행
- http://localhost:3000