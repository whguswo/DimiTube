import { MongoClient, Collection, MongoDBNamespace } from "mongodb";
import crypto from "crypto";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { sendEmail } from "./sendEmail";
import { profileUpload } from "./s3Bucket";
import { loginQuery, registerQuery, editQuery } from "./types";
dotenv.config();

const createHash = (plain: string) => {
	return crypto.createHash("sha256").update(plain).digest("base64");
};
const base64Encode = (plain: string) => {
	return Buffer.from(plain, "utf8")
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};
const base64Decode = (encoded: string) => {
	return Buffer.from(
		encoded.replace(/-/g, "+").replace(/_/g, "/"),
		"base64"
	).toString("utf8");
};

const client = new MongoClient(process.env.DBURL);

const login = async (obj: loginQuery) => {
	await client.connect();
	const db = client.db("dimitube");
	let userCollection = db.collection("user");

	let hashedPassword = createHash(process.env.HASHSALT + obj.password);
	const arr = await userCollection
		.find({ id: obj.id, password: hashedPassword })
		.toArray();
	if (arr.length == 0) {
		return false;
	} else {
		return arr[0];
	}
};

const checkSameAccount = async (
	userCollection: Collection,
	obj: registerQuery
) => {
	const arr = await userCollection
		.find({ $or: [{ id: obj.id }, { email: obj.email }] })
		.toArray();
	// console.log(arr);
	if (arr.length == 0) {
		return true;
	} else {
		return false;
	}
};

const register = async (obj: registerQuery) => {
	await client.connect();
	const db = client.db("dimitube");
	let userCollection = db.collection("user");

	let check = await checkSameAccount(userCollection, obj);
	await client.close();
	if (check) {
		let hashedPassword = createHash(process.env.HASHSALT + obj.password);
		let hashedEmail = createHash(process.env.EMAILSALT + obj.email);
		let info = JSON.stringify({
			id: obj.id,
			password: hashedPassword,
			email: obj.email,
		});
		fs.appendFile(
			"./src/unverified/list.txt",
			`${hashedEmail}::${info}\n`,
			(err) => {
				if (err) throw err;
				console.log("Data Appended!");
				sendEmail(obj.email, hashedEmail);
			}
		);

		return true;
	} else {
		return false;
	}
};

const createUser = async (obj: registerQuery) => {
	await client.connect();
	const db = client.db("dimitube");
	const userCollection = db.collection("user");
	const channelCollection = db.collection("channel");
	const sessionHash = createHash(obj.id + obj.password);
	const file = fs.readFileSync("public/img/default.png");

	//여기서 받는 obj에는 이미 password가 암호화 되어있음.
	await userCollection.insertOne({
		id: obj.id,
		password: obj.password,
		email: obj.email,
		sessionHash: sessionHash,
		channelId: base64Encode(obj.id),
	});
	await channelCollection.insertOne({
		sessionHash: sessionHash,
		channelName: obj.id,
		channelId: base64Encode(obj.id),
		videoList: [],
		message: "@message",
	});
	await profileUpload(file, base64Encode(obj.id));
	console.log("유저 생성 완료");
	await client.close();
};

const verify = async (sessionHash: string) => {
	await client.connect();
	const db = client.db("dimitube");
	const userCollection = db.collection("user");

	const arr = await userCollection.find({ sessionHash: sessionHash }).toArray();
	// await client.close();
	if (arr.length == 0) {
		return false;
	} else {
		return arr[0];
	}
};

const getChannel = async (channel: string) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const arr = await channelCollection.find({ channelId: channel }).toArray();
	// console.log(arr[0].videoList);
	// await client.close();
	if (arr.length == 0) {
		return false;
	} else {
		return arr[0];
	}
};

const addVideoList = async (
	sessionHash: string,
	videoId: string,
	filename: string,
	description: string
) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const channel = await channelCollection.findOne({ sessionHash: sessionHash });

	if (!channel) {
		return false;
	}
	channel.videoList.push({
		owner: channel.channelName,
		channelId: channel.channelId,
		videoId: videoId,
		videoTitle: filename,
		views: 0,
	});
	channelCollection.updateOne(
		{ sessionHash: channel.sessionHash },
		{
			$set: { videoList: channel.videoList },
		}
	);
	videoCollection.insertOne({
		owner: channel.channelName,
		channelId: channel.channelId,
		videoId: videoId,
		videoTitle: filename,
		description: description,
		views: 0,
		comments: [],
	});
	// videoCollection.updateOne({ sessionHash: channel.sessionHash }, { "$set": { "videoList": channel.videoList } })
	// if (recent.recentVideoList.length == 10) {
	//     recent.recentVideoList.pop()
	// }
	// recent.recentVideoList.unshift({
	//     owner: channel.channelName,
	//     channelId: channel.channelId,
	//     videoId: videoId,
	//     videoTitle: filename,
	//     views: 0
	// })
	// channelCollection.updateOne({ type: "recentVideo" }, {
	//     "$set": { "recentVideoList": recent.recentVideoList }
	// })
	// channelCollection.updateOne({ type: "allVideo" }, {
	//     "$push": {
	//         "allVideoList": {
	//             owner: channel.channelName,
	//             channelId: channel.channelId,
	//             videoId: videoId,
	//             videoTitle: filename,
	//             views: 0
	//         }
	//     }
	// })
	return true;
};

const search = async (keyword: string) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const channelArr = await channelCollection
		.find({ channelName: { $regex: keyword, $options: "i" } })
		.toArray();
	const videoArr = await videoCollection
		.find({ videoTitle: { $regex: keyword, $options: "i" } })
		.toArray();
	let channelResult = [];
	let videoResult = [];
	for (let i = 0; i < channelArr.length; i++) {
		channelResult.push({
			channelName: channelArr[i].channelName,
			channelId: channelArr[i].channelId,
		});
	}
	for (let j = 0; j < videoArr.length; j++) {
		videoResult.push(videoArr[j]);
		// videoArr[j]
	}

	if (channelArr.length == 0 && videoArr.length == 0) {
		return false;
	} else {
		return [channelResult, videoResult];
	}
};

const updateSetting = async (sessionHash: string, obj: editQuery) => {
	await client.connect();
	const db = client.db("dimitube");
	const channelCollection = db.collection("channel");

	channelCollection.updateOne(
		{ sessionHash: sessionHash },
		{
			$set: { channelName: obj.channelName, message: obj.message },
		}
	);
	return true;
};

const removeVideo = async (sessionHash: string, videoArr: Array<string>) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const owner = await channelCollection.findOne({
		sessionHash: sessionHash,
	});

	for (let i = 0; i < videoArr.length; i++) {
		const video = await videoCollection.findOne({
			videoId: videoArr[i],
		});

		if (video.channelId == owner.channelId) {
			videoCollection.deleteOne({
				videoId: videoArr[i],
			});
			channelCollection.updateOne(
				{ sessionHash: sessionHash },
				{
					$pull: { videoList: { videoId: { $in: videoArr } } },
				}
			);
		}
	}

	// channelCollection.updateOne({ sessionHash: sessionHash }, {
	//     $pull: { videoList: { videoId: { $in: videoArr } } }
	// })
	// channelCollection.updateOne({ type: "recentVideo" }, {
	//     $pull: { recentVideoList: { videoId: { $in: videoArr } } }
	// })
	// channelCollection.updateOne({ type: "allVideo" }, {
	//     $pull: { allVideoList: { videoId: { $in: videoArr } } }
	// })
};

const getRecentVideo = async () => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");

	const recent = await videoCollection
		.find()
		.sort({ _id: -1 })
		.limit(10)
		.toArray();
	return recent;
};

const getAllVideo = async () => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");

	const all = await videoCollection
		.find({
			videoId: { $ne: "none" },
		})
		.toArray();

	return all;
};

const getVideoInfo = async (videoId: string) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const video = await videoCollection.findOne({ videoId: videoId });
	const owner = await channelCollection.findOne({
		videoList: { $elemMatch: { videoId: videoId } },
	});
	// console.log(video.views);
	return {
		channelId: owner.channelId,
		channelName: owner.channelName,
		videoList: owner.videoList,
		videoTitle: video.videoTitle,
		description: video.videoTitle,
		views: video.views,
		comments: video.comments,
	};
};

const addViews = async (videoId: string) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");

	const video = await videoCollection.findOne({ videoId: videoId });

	videoCollection.updateOne(
		{ videoId: videoId },
		{
			$set: { views: (video.views += 1) },
		}
	);
	//channel add views 수정 예정
};

//댓글 수정할것.
const addComment = async (
	sessionHash: string,
	videoId: string,
	comment: string
) => {
	await client.connect();
	const db = client.db("dimitube");
	const videoCollection = db.collection("video");
	const channelCollection = db.collection("channel");

	const video = await videoCollection.findOne({ videoId: videoId });
	const channel = await channelCollection.findOne({ sessionHash: sessionHash });

	video.comments.unshift({
		channelId: channel.channelId,
		channelName: channel.channelName,
		comment: comment,
	});
	videoCollection.updateOne(
		{ videoId: videoId },
		{
			$set: { comments: video.comments },
		}
	);
	// const channelId = channel.channelId
	// const channelName = channel.channelName
	// const video = await channelCollection.findOne({ videoList: { "$elemMatch": { "videoId": videoId } } })
	// for (let i = 0; i < video.videoList.length; i++) {
	//     if (video.videoList[i].videoId == videoId) {
	//         video.videoList[i].comments.unshift({
	//             channelId: channelId,
	//             channelName: channelName,
	//             comment: comment
	//         })
	//         channelCollection.updateOne({ videoList: { "$elemMatch": { "videoId": videoId } } }, {
	//             "$set": { videoList: video.videoList }
	//         })
	//         break
	//     }
	// }
};

export {
	login,
	register,
	createUser,
	verify,
	getChannel,
	addVideoList,
	search,
	updateSetting,
	removeVideo,
	getRecentVideo,
	getAllVideo,
	getVideoInfo,
	addViews,
	addComment,
};
