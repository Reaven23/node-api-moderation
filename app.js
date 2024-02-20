const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.post('/api/moderation/predict', async (req, res) => {
  try {
    const { text, language } = req.query;
    console.log('Received request:', req.query);


    if (!text || !language) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get('https://moderation.logora.fr/predict', {
      params: {
        text,
        language,
      },
    });

    console.log(response.data);

    const prediction = response.data.prediction['0'];
    console.log(prediction);
    const percent = prediction * 100


    res.json(`La probabilité d'avoir un contenu inadéquat est de ${percent.toFixed(2)}%`)

    // Je ne suis pas sûr de ce qu'il fallait renvoyer mais du coup je renvoie une probabilité chiffrée
    // sinon on pouvait imaginer une réponse comme celle ci :

    // if (prediction > 0.1669644832611084) {
    //   res.json("Vous ne devriez pas accepter ce contenu, il comporte certainement des propos inadequats");
    // } else {
    //   res.json("C'est tout bon, vous pouvez poster ce contenu")
    // };



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/moderation/score', async (req, res) => {
  try {
    const { text, language } = req.query;

    if (!text || !language) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }


    const response = await axios.get('https://moderation.logora.fr/score', {
      params: {
        text,
        language,
      },
    });

    const score = response.data.score;
    res.json(`L'indice de qualité du contenu est de ${score.toFixed(2)}/10`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
