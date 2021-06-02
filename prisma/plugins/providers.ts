import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

const providersPlugin = {
  name: 'app/providers',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/accounts/{cardId}',
        handler: userAccounts,
      },
      {
        method: 'GET',
        path: '/transactions/{cardId}/{fromDate}/{toDate}',
        handler: userTransactions,
      },
      {
        method: 'GET',
        path: '/add-amount/{cardId}/{amount}',
        handler: putAddAmount,
      },	  
    ])
  },
}

dotenv.config()

const userName = process.env.USER_NAME_INFORKOM
const userPass = process.env.USER_KEY_INFORKOM
const contractId = process.env.CONTRACT_INFORKOM	

export default providersPlugin

async function userAccounts(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app
  const cardId = String(request.params.cardId || '')
  //const { json } = request.payload as any
  try {
	const result = await fetch(`https://online.inforkom.ru/exchange?user-name=${userName}&user-pass=${userPass}&function=accounts&contract=${contractId}&cardno=${cardId}&format=json`)
      .then(res => res.json())
	  //.then(json => json)
	return h.response(result).code(200)  
  } catch (err) { console.log(err) }
}

async function userTransactions(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app
  const cardId = String(request.params.cardId || '')
  const fromDate = String(request.params.fromDate || '')
  const toDate = String(request.params.toDate || '')  
  //const { json } = request.payload as any
  try {
	const result = await fetch(`https://online.inforkom.ru/exchange?user-name=${userName}&user-pass=${userPass}&function=transactions&contract=${contractId}&cardno=${cardId}&bdate=${fromDate}&edate=${toDate}&format=json`)
      .then(res => res.json())
	  //.then(json => json)
	return h.response(result).code(200)  
  } catch (err) { console.log(err) }
}

async function putAddAmount(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app
  const cardId = String(request.params.cardId || '')
  const amount = Number(request.params.amount || '')

  const bodyJson = { 'user-name': userName, 'user-pass': userPass, contract: contractId, 'function': 'add-amount', format: 'json', cardno: cardId, amount: amount }
  const body = `user-name=${userName}&user-pass=${userPass}&contract=${contractId}&function=add-amount&cardno=${cardId}&amount=${amount}&format=json`
  //const { json } = request.payload as any
  try {
	const result = await fetch(
	  `https://online.inforkom.ru/exchange?${body}`,
	  { method: 'GET' }
	/*  
    {
	  method: 'post',
	  body: JSON.stringify(bodyJson),
	  headers: {'Content-Type': 'application/json'}
    }
    */	
	)
      .then(res => res.json())
	  //.then(json => json)
	return h.response(result).code(200)  
  } catch (err) { console.log(err) }
}

/*
async function ballance2Handler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app
  //const { name, email, posts } = request.payload as any

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content }
  })

  try {
  
    const createdUser = await ({

    })

    const createdUser = '{alice: 15}'	
    return h.response(createdUser).code(200)
  } catch (err) {
    console.log(err)
  }
}
*/