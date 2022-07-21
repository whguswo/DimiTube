import express, { Request, Response, NextFunction, application } from "express";
import * as fs from "fs";
import {
	login,
	register,
	createUser,
	verify,
	getChannel,
	addVideoList,
	search,
	updateSetting,
	updateVideo,
	removeVideo,
	getRecentVideo,
	getAllVideo,
	getVideoInfo,
	addViews,
	addComment,
} from "./connectDB";
import cookies from "cookie-parser";
import { convert } from "./convertFile";
import { profileUpload, remove } from "./s3Bucket";
import { v4 as uuidv4 } from "uuid";
const { Readable } = require("stream");

const PORT = 3000;
const app = express();

app.use(express.text());
app.use(express.json());
app.use(express.raw({ limit: "1000mb" }));
app.use(express.static("public"));
app.use(cookies());

app.get("/", async (req: Request, res: Response) => {
	let isVerified = await verify(req.cookies.sessionHash);
	if (req.cookies.sessionHash && isVerified) {
		res.cookie("id", isVerified.id);
		res.sendFile("index.html", {
			root: "./views",
		});
	} else {
		res.redirect("/login");
	}
});

app.get("/getVideo", async (req: Request, res: Response) => {
	let recent = await getRecentVideo();
	let all = await getAllVideo();
	res.send({ recentVideoList: recent, allVideoList: all });
	// res.send({ allVideoList: all })
});

app.get("/login", (req: Request, res: Response) => {
	res.sendFile("login.html", {
		root: "./views",
	});
});

app.post("/login", async (req: Request, res: Response) => {
	let result = await login(req.body);
	if (result) {
		if (req.body.remember) {
			res.cookie("sessionHash", result.sessionHash, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
			});
			res.cookie("ownChannelId", result.channelId, {
				maxAge: 1000 * 60 * 60 * 24 * 7,
			});
		} else {
			res.cookie("sessionHash", result.sessionHash, {
				maxAge: 1000 * 60 * 30,
			});
			res.cookie("ownChannelId", result.channelId, {
				maxAge: 1000 * 60 * 30,
			});
		}
		res.send(true);
	} else {
		res.send(false);
	}
});

app.get("/register", (req: Request, res: Response) => {
	res.sendFile("register.html", {
		root: "./views",
	});
});

app.post("/register", async (req: Request, res: Response) => {
	let result = await register(req.body);
	if (result) {
		res.send({
			state: "success",
			message: "인증 이메일을 보냈습니다.\n이메일 인증후에 로그인 해주세요.",
		});
		console.log("회원가입 성공");
	} else {
		res.send({
			state: "fail",
			message: "회원가입에 실패했습니다.\n아이디나 이메일이 이미 사용중입니다.",
		});
		console.log("중복계정!");
	}
});

app.get("/verify", (req: Request, res: Response) => {
	let flag = false;
	fs.readFile("./src/unverified/list.txt", function (err, data) {
		let arr = data.toString().split("\n");
		for (let i in arr) {
			let compare = arr[i].split("::");

			if (compare[0] == req.query.hash) {
				flag = true;
				createUser(JSON.parse(compare[1]));
				fs.writeFile(
					"./src/unverified/list.txt",
					data.toString().replace(`${req.query.hash}::${compare[1]}\n`, ""),
					"utf-8",
					() => {
						if (err) throw err;
						console.log("list.txt 수정완료!");
					}
				);
				res.sendFile("verify.html", {
					root: "./views",
				});
			}
		}
		if (!flag) {
			console.log("인증실패");
			res.sendFile("verifyFail.html", {
				root: "./views",
			});
		}
	});
});

app.get("/channel/:channelName", (req: Request, res: Response) => {
	res.sendFile("channel.html", {
		root: "./views",
	});
});

app.post("/channel/:channelName", async (req: Request, res: Response) => {
	// res.send(req.params.channelName);
	const result = await getChannel(req.params.channelName);
	if (result) {
		if (result.sessionHash === req.cookies.sessionHash) {
			res.send(
				JSON.stringify({
					channelName: result.channelName,
					channelId: result.channelId,
					videoList: result.videoList,
					message: result.message,
					isOwner: true,
				})
			);
		} else {
			res.send(
				JSON.stringify({
					channelName: result.channelName,
					channelId: result.channelId,
					videoList: result.videoList,
					message: result.message,
					isOwner: false,
				})
			);
		}
	}
});

app.get("/channel/:channelName/upload", (req: Request, res: Response) => {
	res.sendFile("upload.html", {
		root: "./views",
	});
});

app.post(
	"/channel/:channelName/upload",
	async (req: Request, res: Response) => {
		let filename = req.query.filename.toString();
		let description = req.query.description.toString();
		let videoId = uuidv4();
		fs.mkdirSync(`videos/${videoId}`);
		let result = await addVideoList(
			req.cookies.sessionHash,
			videoId,
			filename,
			description
		);
		if (result) {
			const stream = await Readable.from(req.body);
			convert(videoId, stream);
		}
	}
);

app.get("/watch", (req: Request, res: Response) => {
	res.sendFile("watch.html", {
		root: "./views",
	});
});

app.post("/comment", async (req: Request, res: Response) => {
	addComment(req.cookies.sessionHash, req.body.videoId, req.body.comment);
});

app.get("/getVideoInfo/:videoId", async (req: Request, res: Response) => {
	let videoId = req.params.videoId;
	let result = await getVideoInfo(videoId);
	let addView = await addViews(videoId);
	res.send(result);
});

app.get("/search", (req: Request, res: Response) => {
	res.sendFile("search.html", {
		root: "./views",
	});
});

app.post("/search", async (req: Request, res: Response) => {
	const result = await search(decodeURI(req.body.query));

	if (result) {
		res.send({ state: "success", channels: result[0], videos: result[1] });
	} else {
		res.send({ state: "fail", channels: [], videos: [] });
	}
});

app.get("/channel/:channelName/setting", (req: Request, res: Response) => {
	res.sendFile("setting.html", {
		root: "./views",
	});
});

app.post("/channel/:channelName/setting", async (req: Request, res: Response) => {
	await updateSetting(req.cookies.sessionHash, req.body);
	res.send({ state: "success", message: "채널 설정이 변경되었습니다." });
});

app.get("/video/:videoId", (req: Request, res: Response) => {
	res.sendFile("videoSetting.html", {
		root: "./views",
	});
})

app.post("/video/:videoId", async (req: Request, res: Response) => {
	let videoId = req.params.videoId
	let sessionHash = req.cookies.sessionHash
	let user = await verify(sessionHash)
	updateVideo(user, videoId, req.body.videoTitle, req.body.videoDesc)
})

app.post(
	"/channel/:channelName/removeVideo",
	async (req: Request, res: Response) => {
		for (let i = 0; i < req.body.videoList.length; i++) {
			remove(req.body.videoList[i]);
		}
		await removeVideo(req.cookies.sessionHash, req.body.videoList);
		res.send({ state: "success", message: "영상이 삭제되었습니다." });
	}
);

app.post(
	"/channel/:channelName/setProfile",
	async (req: Request, res: Response) => {
		const result = await getChannel(req.cookies.ownChannelId);
		if (result) {
			if (result.sessionHash === req.cookies.sessionHash) {
				profileUpload(req.body, result.channelId);
			}
		}
	}
);

app.get("/easteregg", (req: Request, res: Response) => {
	res.sendFile("egg.html", {
		root: "./views",
	});
});

app.listen(PORT, () => {
	console.log(`[SERVER] Server is started on port ${PORT}`);
});
