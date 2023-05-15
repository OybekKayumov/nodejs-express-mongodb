const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      // console.log('res: ', res.body);
      console.log('res: ', res.body.message);

      // save img to file
      fs.writeFile('dog-img.txt', res.body.message, err => {
        console.log('Random dog image saved to file...');
      })
    });
});

