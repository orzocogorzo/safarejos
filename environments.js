module.exports = {
  dev: {
    name: 'development',
    apiURL: 'data'
  },
  pi: {
    name: 'raspberry_env',
    apiURL: 'rs/json',
    host: "http://www.orzopi.tk"
  },
  prod: {
    name: 'production',
    apiURL: 'data/json'
  }
}
