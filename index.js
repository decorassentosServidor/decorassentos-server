const express = require('express')
const cors = require('cors')
const cron = require('node-cron');
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

    setBirthDate(data)
    return res.status(200).json({ data });

  } catch (error) {
    if (error.message === "Request failed with status code 304") return res.status(400).json({ error: 'Usuário já registrado' });
    return res.status(401).json({ error });
  }
})

const verifyBirthDate = (birthDate) => {
  const clientBirthDate = new Date(birthDate.replace('Z', ''))
  const today = new Date()

  if (clientBirthDate.getDate() === today.getDate() 
      && (clientBirthDate.getMonth() + 1) === (today.getMonth() + 1)) {
    return true
  }
  return false
}

const setBirthDate = async (data) => {
    const { birthDate, id } = data[0]
      try{
        await axios({
         method: "PATCH",
         url: `${baseUrl}/api/dataentities/CL/documents/${id}`,
         headers: {
           accept: "application/vnd.vtex.ds.v10+json",
           "content-type": "application/json",
           "x-vtex-api-appkey": process.env.APPKEY,
           "x-vtex-api-apptoken": process.env.APPTOKEN,
         },
         data: {
           aniversariante: verifyBirthDate(birthDate)
         }
       });
    
     } catch (error) {
       console.log(error)
      //if (error.message === "Request failed with status code 304") return res.status(400).json({ error: 'Usuário já registrado' });
      //return res.status(401).json({ error });
     }
}



app.listen(PORT, () => {
  console.log('running on ' + PORT);
})