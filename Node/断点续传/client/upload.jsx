import React, { ChangeEvent, useState, useEffect } from 'react'
import { Row, Col, Input, Button, message, Table, Progress } from 'antd'
import { request } from './request.jsx'

const CHUNK_SIZE = 1024 * 1024 * 100 // 分片大小

const UploadStatus = {
	INIT: 0,
	PAUSE: 1,
	UPLOADING: 2
}

let [uploadStatus, setUploadStatus] = useState(UploadStatus.INIT)
let [currentFile, setCurrentFile] = useState()
let [objectURL, setObjectURL] = useState('')
let [hashPercent, setHashPercent] = useState(0)
let [filename, setFilename] = useState('')
let [partList, setPartList] = useState([])

useEffect(() => {
	if (currentFile) {
		const reader = new FileReader();
		reader.addEventListener('load', () => setObjectURL(reader.result));
		reader.readAsDataURL(currentFile);
	}
}, [currentFile])

// 总进度
let totalPercent = partList.length > 0
	? partList.reduce((acc, curr) => acc + curr.percent, 0) / (partList.length * 100) * 100
	: 0

let columns = [
	{
		title: '切片名称',
		dataIndex: "filename",
		key: 'filename',
		width: '20%'
	},
	{
		title: '进度',
		dataIndex: "percent",
		key: 'percent',
		width: '80%',
		render: value => {
			return <Progress percent={value} />
		}
	}
]

let uploadProgress = uploadStatus !== UploadStatus.INIT
	? (
		<>
			<Row>
				<Col span={4}>
					HASH总进度:
        </Col>
				<Col span={20}>
					<Progress percent={hashPercent} />
				</Col>
			</Row>
			<Row>
				<Col span={4}>
					总进度:
        </Col>
				<Col span={20}>
					<Progress percent={totalPercent} />
				</Col>
			</Row>
			<Table
				columns={columns}
				dataSource={partList}
				rowKey={row => row.chunk_name}
			/>
		</>
	)
	: null

function handleChange(event) {
	const file = event.target.files || event.target.files[0]
	setCurrentFile(file)
}

/**
 * ! 分片
 */
function createChunks() {
	let current = 0
	let partList = []
	while (current < currentFile.size) {
		let chunk = currentFile.slice(current, current + CHUNK_SIZE)
		partList.push({ chunk, size: chunk.size })
		current += CHUNK_SIZE
	}
	return partList
}

function calculateHash(partList) {
	return new Promise(resolve => {
		let worker = new Worker('./hash.jsx')
		worker.postMessage({ partList })
		worker.onmessage = event => {
			let { percent, hash } = event
			setHashPercent(percent)
			hash && resolve(hash)
		}
	})
}

async function verify() {
	return await request({
		url: `/verify/${filename}`,
	})
}

function reset() {
	setUploadStatus(UploadStatus.INIT);
	setHashPercent(0);
	setPartList([]);
	setFilename('');
}

function createRequests(partList, uploadList, filename) {
	return partList.filter(part => {
		let uploadFile = uploadList.find(item => item.filename === part.chunk_name)
		if (!uploadFile) {
			part.loaded = 0  // 已经上传的字节数据
			part.percent = 0 // 已经上传的百分比就是0 分片上传过的百分比
			return true
		}
		if (uploadFile.size < part.chunk.size) {
			part.loaded = uploadFile.size
			part.percent = Number((part.loaded / part.chunk.size * 100).toFixed(2)) // 已经上传过的百分比
			return true
		}
		return false
	}).map(part => (
		request({
			url: `/upload/${filename}/${part.chunk_name}/${part.loaded}`,//请求的URL地址
			method: 'POST',//请求的方法
			headers: { 'Content-Type': 'application/octet-stream' },//指定请求体的格式
			setXHR: xhr => part.xhr = xhr,
			onProgress: event => {
				part.percent = Number(((part.loadeD + event.loaded) / part.chunk.size * 100).toFixed(2))
				setPartList([...partList])
			},
			data: part.chunk.slice(part.loaded) //请求
		})
	))
}

/**
 * todo 分片上传 
 */
async function uploadParts(partList, filename) {
	let { needUpload, uploadList } = await verify()
	if (!needUpload) {
		return message.success('上传成功')
	}
	try {
		let requests = createRequests(partList, uploadList,)
		await Promise.all(requests)
		await request({ url: `/merge/${filename}` }) // 分片上传完成，通知后台合并
		message.success('上传成功')
		reset()
	} catch (err) {
		message.error('上传失败')
	}
}

function handleUpload() {
	if (!currentFile) {
		return message.error('你尚未选择任何文件！')
	}
	if (!allowUpload()) {
		return message.error('不支持此类文件的上传')
	}
	setUploadStatus(UploadStatus.UPLOADING)
	// 分片上传
	const partList = createChunks()
	// 先计算这个对象哈希值  秒传的功能 通过webworker子进程来去计算哈希
	let fileHash = await calculateHash(partList)
	let lastDotIndex = currentFile.name.lastIndexOf('.')
	let extName = currentFile.slice(lastDotIndex)
	let filename = `${fileHash}${extName}`
	partList.forEach((item, index) => {
		item.filename = filename
		item.chunk_name = `${filename}-${index}`
		item.loaded = 0
		item.percent = 0
	})
	setPartList(partList)
	uploadParts(partList, filename)
}

function handlePause() {
	partList.forEach(part => part.xhr && part.xhr.abort())
	setUploadStatus(UploadStatus.PAUSE)
}

function handleResume() {
	uploadParts()
	setUploadStatus(UploadStatus.UPLOAD)
}

export default function Upload() {
	return (
		<>
			<Row>
				<Col span={12}>
					<Input type="file" style={{ width: 300 }} onChange={handleChange} />
					{
						uploadStatus === UploadStatus.INIT &&
						<Button type="primary" onClick={handleUpload} style={{ marginLeft: 10 }}>上传</Button>
					}
					{
						uploadStatus === UploadStatus.UPLOADING &&
						<Button type="primary" onClick={handlePause} style={{ marginLeft: 10 }}>暂停</Button>
					}
					{
						uploadStatus === UploadStatus.PAUSE &&
						<Button type="primary" onClick={handleResume} style={{ marginLeft: 10 }}>恢复</Button>
					}
				</Col>
				<Col span={12}>
					{objectURL && <img src={objectURL} style={{ width: 100 }} />}
				</Col>
			</Row>

			{uploadProgress}
		</>
	)
}
