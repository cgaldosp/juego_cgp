var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;

    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/pac_man.png');
      game.load.image('objetivo', 'assets/cerveza.jpg');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });

      objetivo = game.add.sprite(app.inicioX(), 0, 'objetivo');
      bola = game.add.sprite(ancho/2 - DIAMETRO_BOLA/ 2, alto, 'bola');

      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);

      bola.body.collideWorldBounds = true;
      objetivo.body.collideWorldBounds = true;
      objetivo.body.onWorldBounds = new Phaser.Signal();
      objetivo.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      objetivo.body.velocity.y = ((dificultad + 1) * 100);

      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-10;
    dificultad = 0;
    if("vibrate" in window.navigator) {
      window.navigator.vibrate(100);
    }
    objetivo.body.x = app.inicioX();
    objetivo.body.y = 0;
    if (puntuacion < -20){
      alert('Perdió la partida. Siga intentando');
      puntuacion = 0;
      app.recomienza;
    }
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = 0;

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
    if (puntuacion == 5){
      alert('Felicitaciones, ganó.');
      puntuacion = 0;
      app.recomienza;
    }
    scoreText.text = puntuacion;
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){

    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = 0 ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
