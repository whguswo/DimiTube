import express, { Request, Response, NextFunction, application } from 'express';
import * as fs from "fs";
import { login, register, createUser, verify, getChannel, addVideoList, search } from './connectDB';
import cookies from 'cookie-parser';
import { convert } from './convertFile';
import { v4 as uuidv4 } from 'uuid';

const PORT = 3000
const app = express();

app.use(express.text());
app.use(express.json());
app.use(express.raw({ limit: '1000mb' }));
app.use(express.static('public'));
app.use(cookies());

app.get('/', async (req: Request, res: Response) => {
    let isVerified = await verify(req.cookies.sessionHash)
    if (req.cookies.sessionHash && isVerified) {
        res.cookie('id', isVerified.id)
        res.sendFile('index.html', {
            root: './views'
        })
    } else {
        res.redirect('/login')
    }
});

app.get('/login', (req: Request, res: Response) => {
    res.sendFile('login.html', {
        root: './views'
    })
})

app.post('/login', async (req: Request, res: Response) => {
    let result = await login(req.body)
    if (result) {
        if (req.body.remember) {
            res.cookie('sessionHash', result.sessionHash, {
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            res.cookie('ownChannelId', result.channelId, {
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
        } else {
            res.cookie('sessionHash', result.sessionHash, {
                maxAge: 1000 * 60 * 30
            })
            res.cookie('ownChannelId', result.channelId, {
                maxAge: 1000 * 60 * 30
            })
        }
        res.send(true)
    } else {
        res.send(false)
    }
})

app.get('/register', (req: Request, res: Response) => {
    res.sendFile('register.html', {
        root: './views'
    })
})

app.post('/register', async (req: Request, res: Response) => {
    let result = await register(req.body)
    if (result) {
        res.send({ "state": "success", "message": "인증 이메일을 보냈습니다.\n이메일 인증후에 로그인 해주세요." })
        console.log("회원가입 성공")
    } else {
        res.send({ "state": "fail", "message": "회원가입에 실패했습니다.\n아이디나 이메일이 이미 사용중입니다." })
        console.log("중복계정!")
    }
})

app.get('/verify', (req: Request, res: Response) => {
    let flag = false
    fs.readFile('./src/unverified/list.txt', function (err, data) {
        let arr = data.toString().split("\n");
        for (let i in arr) {

            let compare = arr[i].split("::")

            if (compare[0] == req.query.hash) {
                flag = true
                createUser(JSON.parse(compare[1]))
                fs.writeFile('./src/unverified/list.txt', data.toString().replace(`${req.query.hash}::${compare[1]}\n`, ""), 'utf-8', () => {
                    if (err) throw err;
                    console.log('list.txt 수정완료!');
                })
                res.sendFile('verify.html', {
                    root: './views'
                })
            }
        }
        if (!flag) {
            console.log('인증실패')
            res.sendFile('verifyFail.html', {
                root: './views'
            })
        }

    });
})

app.get('/channel/:channelName', (req: Request, res: Response, nex) => {
    res.sendFile('channel.html', {
        root: './views'
    })
})

app.post('/channel/:channelName', async (req: Request, res: Response) => {
    // res.send(req.params.channelName);
    const result = await getChannel(req.params.channelName)
    if (result) {
        if (result.sessionHash === req.cookies.sessionHash) {
            res.send(JSON.stringify({ channelName: result.channelName, videoList: result.videoList, isOwner: true }))
        } else {
            res.send(JSON.stringify({ channelName: result.channelName, videoList: result.videoList, isOwner: false }))
        }
    }
})

app.get('/channel/:channelName/upload', (req: Request, res: Response) => {
    res.sendFile('upload.html', {
        root: './views'
    })
})

app.post('/channel/:channelName/upload', (req: Request, res: Response) => {
    // 영상 구현할것.
    let filename = req.query.filename.toString()
    let videoId = uuidv4()
    fs.mkdirSync(`videos/${videoId}`)
    fs.writeFile(`videos/${videoId}/${videoId}.mp4`, req.body, async (err) => {
        if (err) console.log(err)
        let result = await addVideoList(req.cookies.sessionHash, videoId, filename)
        if (result) {
            convert(videoId)
        }

    })

})

app.get('/watch', (req: Request, res: Response) => {
    res.sendFile('watch.html', {
        root: './views'
    })
})

app.get('/search', (req: Request, res: Response) => {
    res.sendFile('search.html', {
        root: './views'
    })
})

app.post('/search', async (req: Request, res: Response) => {
    const result = await search(decodeURI(req.body.query))

    if (result) {
        res.send({ state: "success", channels: result[0], videos: result[1] })
    } else {
        res.send({ state: "fail" })
    }
})

app.get('/easteregg', (req: Request, res: Response) => {
    res.sendFile('egg.html', {
        root: './views'
    })
})

app.listen(PORT, () => {
    console.log(`[SERVER] Server is started on port ${PORT}`)
});