import Clarifai from 'clarifai';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
    apiKey: process.env.API_KEY
  });
const handleApiCall = (req, res) => {
 app.models
      .predict(
        {
          id: 'face-detection',
          name: 'face-detection',
          version: process.env.version,
          type: 'visual-detector',
        }, req.body.input)
.then(data => {
    res.json(data)
})
.catch(err => res.status(400).json('unable to work with API'))
}
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entry => res.json(entry[0].entries))
      .catch(err => res.status(400).json('unable to get entries'))
      }

export default {handleImage, handleApiCall};
