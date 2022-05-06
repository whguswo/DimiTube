import express, { Request, Response, NextFunction, application } from 'express';
import * as fs from "fs";
import { sendEmail } from './sendEmail';
import { login, register, createUser, verify } from './connectDB';
import cookies from 'cookie-parser';

const PORT = 3000
const app = express();

app.use(express.text());
app.use(express.json());
app.use(express.raw({ limit: '50mb' }));
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
        res.cookie('sessionHash', result.sessionHash)
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
        console.log("회원가입 성공")
    } else {
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

app.get('/easteregg', (req: Request, res: Response) => {
    res.sendFile('egg.html', {
        root: './views'
    })
})

app.listen(PORT, () => {
    console.log(`[SERVER] Server is started on port ${PORT}`)
});