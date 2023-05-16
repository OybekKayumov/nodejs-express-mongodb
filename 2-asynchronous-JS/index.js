const fs = require('fs');
const superagent = require('superagent');

// using call-backs inside of call-backs inside of call-backs 
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);

      // console.log('res: ', res.body);
      console.log('res: ', res.body.message);

      // save img to file
      fs.writeFile('dog-img.txt', res.body.message, err => {
        if (err) return console.log(err.message);
        console.log('Random dog image saved to file...');
      })
    });
});
*/

// 42. From Callback Hell to Promises
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
      .then(res => {
        console.log(res.body.message);

        // save img to file
        fs.writeFile('dog-img.txt', res.body.message, err => {
          if (err) return console.log(err.message);
          console.log('Random dog image saved to file...');
        })
      })
      .catch(err => {
        console.log(err.message);
      })
});
*/


// 43. Building Promises
const readFilePromise = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find file...')
      resolve(data);  // call the resolve with data
    })
  });
}

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write file...');
      resolve('success...')
    });
  });
};

/*
readFilePromise(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
  })
  .then(res => {
    console.log(res.body.message);
    return writeFilePromise('dog-img.txt', res.body.message)
  })
  .then(() => {
    console.log('Random dog image saved to file...');
  })
  .catch(err => {
    console.log(err);
  })
*/

// 44. Consuming Promises with Async/Await
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`)
    console.log(`Breed: ${data}`);
    
    const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    console.log(res.body.message);
    
    await writeFilePromise('dog-img.txt', res.body.message)
    console.log('Random dog image saved to file...');
  } catch (err) {
    console.log(err);
  }
  
}

console.log('1: Will get dog pics!');
getDogPic();
console.log('2: Done getting dog pics!');

// 1: Will get dog pics!      // !
// 2: Done getting dog pics!  // !
// Breed: retriever
// https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_3645.jpg                                                               jpg 
// Random dog image saved to file...
