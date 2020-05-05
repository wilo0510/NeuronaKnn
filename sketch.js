var Camara;
var BotonesEntrenar;
var Modelo;
var Knn;
var Texto;
var Clasificando=false;
var InputTextBox;
var BotonTextBox;

function setup() {
 createCanvas(320,240);
 Camara=createCapture(VIDEO);
 Camara.size(320,240);
 Camara.hide();

 Modelo = ml5.featureExtractor('MobileNet', ModeloListo);
 Knn = ml5.KNNClassifier();

 createP('Presiona los botones para entrenar');
 var BotonArduino = createButton("Arduino");
 BotonArduino.class("BotonEntrenar");

 var BotonEsp8266 = createButton("ESP8266");
 BotonEsp8266.class("BotonEntrenar");

 var BotonUltrasonido = createButton("Ultrasonido");
 BotonUltrasonido.class("BotonEntrenar");

 var BotonNada = createButton("Nada");
 BotonNada.class("BotonEntrenar");

 createP("Entrena usando TextBox");
InputTextBox=createInput("Ingrese elemento");
BotonTextBox=createButton("Entrenar con "+InputTextBox.value());
BotonTextBox.mousePressed(EntrenarTextBox);

Texto= createP("Modelo no listo, esperando ...")

 BotonesEntrenar=selectAll(".BotonEntrenar");
 for(var B=0;B<BotonesEntrenar.length;B++){
   BotonesEntrenar[B].style("margin","5px");
   BotonesEntrenar[B].style("padding","6px");
   BotonesEntrenar[B].mousePressed(BotonPresionado);
 }
}
function EntrenarKnn(ObjetoEntrenar){
  const Imagen=Modelo.infer(Camara);
  Knn.addExample(Imagen,ObjetoEntrenar );
}

function BotonPresionado(){
  var NombreBoton=this.elt.innerHTML;
  console.log("Entrenando con "+ NombreBoton);
  EntrenarKnn(NombreBoton);
}
function ModeloListo(){
  console.log("Modelo Listo");
  Texto.html("Modelo listo, puede entrenar la neurona");
}
function clasificar(){
  const Imagen=Modelo.infer(Camara);
  Knn.classify(Imagen,function(error,result){
    if(error){
      console.error();
    }
    else{
      Texto.html("Es un"+ result.label);
      clasificar();
    }
  });
}
function EntrenarTextBox(){
  const Imagen=Modelo.infer(Camara);
  Knn.addExample(Imagen,InputTextBox.value());
}
function draw() {
  image(Camara,0,0,320,240);
  BotonTextBox.html("Entrenar con "+ InputTextBox.value());
  if(Knn.getNumLabels()>0 && !Clasificando){
    clasificar();
    Clasificando=true;
  }
}
