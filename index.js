const express = require('express')
const cors = require('cors')
const axios = require('axios').default
const dotenv = require('dotenv');

const app = express()
dotenv.config()

const PORT = process.env.PORT || 9001;
const baseUrl = 'https://www.decorassentos.com.br'

app.use(cors())
app.use(express.json())

app.get('/:email', async (req, res) => {
  const { email } = req.params
  console.log(req.params)
  try{
    const { data } = await axios({
      method: "GET",
      url: `${baseUrl}/api/dataentities/CL/search?_where=email=${email}&_fields=birthDate,id,aniversariante`,
      headers: {
        accept: "application/vnd.vtex.ds.v10+json",
        "content-type": "application/json",
        "x-vtex-api-appkey": process.env.APPKEY,
        "x-vtex-api-apptoken": process.env.APPTOKEN,
      }
    })

    return res.status(200).json({ data });

  } catch (error) {
    if (error.message === "Request failed with status code 304") return res.status(400).json({ error: 'Usuário já registrado' });
    return res.status(401).json({ error });
  }
})

app.post('/register?:params', async (req, res) => {
  const { email, aniversariante } = req.query
  try{
    const { data } = await axios({
      method: "PATCH",
      url: `${baseUrl}/api/dataentities/CL/documents`,
      headers: {
        accept: "application/vnd.vtex.ds.v10+json",
        "content-type": "application/json",
        "x-vtex-api-appkey": process.env.APPKEY,
        "x-vtex-api-apptoken": process.env.APPTOKEN,
      },
      data:{
        email,
        aniversariante
      }
    })
    return res.status(200).json({ data });

  } catch (error) {
    if (error.message === "Request failed with status code 304") return res.status(400).json({ error: 'Usuário já registrado' });
    return res.status(401).json({ error });
  }
})

app.listen(PORT, () => {
  console.log('running on ' + PORT);
})