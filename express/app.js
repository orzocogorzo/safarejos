const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const config = require('../webpack.config.js');
const envConfig = new Object();

const http = require('http');
const express = require('express');
const livereload = require('express-livereload');
const reload = require('./liveserver');

const distDir = path.resolve(__dirname,'../dist');
const srcDir = path.resolve(__dirname, '../src');

var LISTENING=false;

function flagMatcher(flag){
  let name,val;
  [name,val] = flag.split('=');
  envConfig[name.replace(/\-+/,'')] = val || true;
}

function registerEnvironment(callback){
  const environments = require('../environments.js');
  envConfig["env"] = env = environments[envConfig["env"]];
  
  if (!env) {
    console.log("Not recognized environment declaration");
    return;
  } else {
    fs.writeFile( path.resolve( distDir, 'environment.js' ), ' window.environment='+JSON.stringify(env)+';', function( err ) {
      if ( err ) {
        console.log('Error on writing env dist file\n');
        return;
      };
      console.log('Environment variable registered with exit. Defined as ' + env.name);
      callback();
    });
  
  }
}

function buildRegex( urlParam ){
  let basehref = envConfig.basehref || envConfig.env.basehref || null
  if ( urlParam ){
    return new RegExp("^\/" + (basehref && (basehref + "/" + urlParam)
    || urlParam) + "\/(.*)");
  } else {
    return new RegExp("^" + (basehref && ("\/" + basehref) || '') + "(.*)");
  }
};

function fileLoader( filePath, res, redirect ) {
  fs.exists( filePath, ( exists ) => {
    if (exists){
      var stats = fs.statSync( filePath );
      if (!stats.isFile()){
        if (redirect){
          filePath = path.resolve( distDir, 'index.html' );
        } else {
          res.sendStatus(404);
          return;
        }
      };
    } else {
      if (redirect) {
        filePath = path.resolve( distDir, 'index.html' );
      } else {
        res.sendStatus(404);
        return;
      }
    };

    var file = fs.readFile( filePath, 'utf-8', ( err, data ) => {
      res.send( data );
    });

  });
};


function setupApp(){
  var app = express();

  app.get('/', ( req, res ) => {
    var file = fs.readFile( path.resolve( distDir, 'index.html' ), 'utf-8', ( err, data ) => {
      res.send( data );
    });
  });

  app.get('/environment.js', ( req, res ) => {
    var file = fs.readFile( path.resolve( distDir, 'environment.js' ), 'utf-8', ( err, data ) => {
      res.send( data );
    });
  });

  app.get('/main.js', ( req, res ) => {
    var file = fs.readFile( path.resolve( distDir, 'main.js' ), 'utf-8', ( err, data ) => {
      res.send( data );
    });
  });

  app.get(buildRegex(), ( req, res ) => {
    var redirectPath = req.params[0].replace(new RegExp(`\/${envConfig.env.basehref}\/`),'');
    
    if (redirectPath.indexOf(envConfig.env.apiURL) >= 0) {
      // Local API ROUTE
      redirectPath = redirectPath.replace(new RegExp(`\/${envConfig.env.apiURL}\/`),'');
      var filePath = path.resolve(srcDir, 'data', redirectPath);
      fileLoader( filePath, res, false ); 
    } else {
      var filePath = path.resolve( distDir, redirectPath );
      fileLoader( filePath, res, true );
    }
  });

  app.set('port', envConfig.port || 8000);

  return app;
;}

function main(){
  // register env flags as config object
  process.argv.slice(2).forEach(function (val, index, array) {
    flagMatcher(val);
  });
  
  var compiler;

  if ( envConfig["dev"] ) {
    
    function callback(){
      const app = setupApp();
      
      config.watch = true;
      config.mode = "development";

      function startApp(){
        if (LISTENING){return}
        // Serve the files on port 8000.
        server = http.createServer(app);
        
        // server livereload
        reload(app);

        // browser livereload
        livereload(app, {watchDir: srcDir});

        server.listen(app.get('port'), function () {
          console.log('Webpack watching for changes and app listening on port 8000!\n');
          LISTENING=true;
        });
      }
      compiler = webpack(config, (err, stats) => {
        if (err) throw err;
        startApp()
      });
    }
  } else if (envConfig["build"]){
    function callback(){
      config.mode = envConfig["prod"] && "production" || "development";
      
      compiler = webpack( config, ( err, stats ) => {
        if (err) throw err
        console.log("Webpack build end with exit status");
      });
    }
  } else {
    console.log('Unrecognized target action');
    return;
  };

  registerEnvironment(callback);
}

// run the application
main();