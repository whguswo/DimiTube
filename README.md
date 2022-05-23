# DimiTube

디미고 학생용 동영상 플랫폼입니다.  

### [Dimitube](http://dimitube.kro.kr/)  


# 폴더 구조

```bash
.
├─public
│  ├─css           # 각 페이지의 디지인(css) 폴더
│  ├─js            # 각 페이지의 js
│  ├─img           # 각종 이미지(로고, 아이콘) 폴더
│  └─font          # css에 포함되는 폰트
├─src
│   ├─unverified
│   │  └─list.txt           # 이메일 인증을 하지않은 계정의 정보
│   ├─index.ts              # 클라이언트의 요청을 처리하는 main 파일 	
│   ├─connectDB.ts          # MongoDB와 관련된 작업(로그인, 회원가입 등)을 수행하는 파일
│   ├─sendEmail.ts          # 이메일 인증 메일을 보내는 파일
│   ├─s3Bucket.ts           # s3 Bucket에 영상 업로드, 삭제하는 파일
│   └─types.ts              # 쿼리등의 타입을 선언하는 파일
└─views    
│   ├─index.html            # 메인페이지
│   ├─login.html            # 로그인 페이지
│   ├─register.html         # 회원가입 페이지
│   ├─channel.html          # 채널페이지
│   ├─search.html           # 검색페이지
│   ├─setting.html          # 설정페이지
│   ├─upload.html           # 영상 업로드 페이지
│   ├─watch.html            # 영상 시청 페이지
│   ├─verify.html           # 이메일 인증 성공시
│   └─verifyFail.html       # 이메일 인증 실패시(주소가 틀리거나 잘못된 접근)
└─dist              # Typescript 컴파일 결과물
```

# 사용법

```bash
npm i
npm run start       # 프로그램 실행 시 ( + 컴파일 )
npm run test        # 컴파일 되어있는 것 실행
```