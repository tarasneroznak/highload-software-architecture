const urlToPass = 'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg';

const baseUrl = 'https://rdte3arudvbokaimeczuyhmfsm0ettta.lambda-url.us-east-1.on.aws'
const finalUrl = `${baseUrl}?url=${encodeURIComponent(urlToPass)}&to=png`;

console.log(finalUrl);