import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, TextInput, Alert} from 'react-native';

export default function App() {

  const [modoSeleccionado, setModo] = useState(null);
  const [juegoEmpezado, setJuegoEmpezado] = useState(false);
  const [numeroSecreto, setNumeroSecreto] = useState([]); 
  const [valoresIngresados, setValoresIngresados] = useState(['', '', '', '']);
  const [valoresIngresadosLog, setValoresIngresadosLog] = useState([[], [], [], [], [], [], [], [], [], []])
  const [inputsHabilitados, setInputsHabilitados] = useState([true, false, false, false, false, false, false, false, false, false]);
  const [brm, setBRM] = useState(['', '', ''])
  const [brmlog, setBRMlog] = useState([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
  const [intentos, setIntentos] = useState(0);

  const manejadorModo = (modoSeleccionado) => {
    setModo(modoSeleccionado);
    generarNumeroSecreto(modoSeleccionado);
    console.log(`Mode selected: ${modoSeleccionado}`);
  };

  //Juego
  const generarNumeroSecreto = (modo) => {
    const listaNumeroSecreto = []
    //modo facil: los numeros pueden repetirse
    if (modo === 'facil') {
      while (listaNumeroSecreto.length < 4) {
        var numeroAleatorio = Math.floor(Math.random() * 10);
        console.log(numeroAleatorio)
        listaNumeroSecreto.push(numeroAleatorio.toString());
      }
      //A lo random me traigo dos indices distintos
      let indiceAleatorio1 = Math.floor(Math.random() * 4);
      let indiceAleatorio2;
      do {
        indiceAleatorio2 = Math.floor(Math.random() * 4);
      } while (indiceAleatorio1 === indiceAleatorio2);
      //Me aseguro de que al menos una vez se repita un numero, el elemento del indice1 se reemplaza por el elemento del indice2
      listaNumeroSecreto[indiceAleatorio1] = listaNumeroSecreto[indiceAleatorio2];
    } //modo dificil: los numeros no pueden repetirse
    else if (modo === 'dificil') {
      while (listaNumeroSecreto.length < 4) {
        var numeroAleatorio = (Math.floor(Math.random() * 10)).toString();
        if (!listaNumeroSecreto.includes(numeroAleatorio)) {
          listaNumeroSecreto.push(numeroAleatorio.toString());
        }
      }
    };

    console.log(listaNumeroSecreto);
    setNumeroSecreto(listaNumeroSecreto);
    setJuegoEmpezado(true);
  };

  const manejadorValorIngresado = (index, value) => {
    const newInputValues = [...valoresIngresados];
    newInputValues[index] = value;
    setValoresIngresados(newInputValues);

    // Guardar los números ingresados en el log
    const nuevoValoresIngresadosLog = [...valoresIngresadosLog]; // Copia el array existente
    nuevoValoresIngresadosLog[intentos] = newInputValues; 
    setValoresIngresadosLog(nuevoValoresIngresadosLog);

    //console.log(nuevoValoresIngresadosLog, 'logito')
  };

  manejadorBotonComprobar = () => {
    //primero verifica si algun valor ingresado es vacio
    const estaVacio = valoresIngresados.some(value => value === '');
    //segundo verifica si los numeros ingresados son del 0 al 9
    const esNumeroValido = valoresIngresados.every(value => parseInt(value) >= 0 && parseInt(value) <= 9);

    if (estaVacio) {
      Alert.alert('Aviso', 'Debes completar todos los campos');
    } 
    else if (esNumeroValido === false) {
      Alert.alert('Aviso', 'Cada campo debe ser un numero del 0 al 9');
    }
    else {
      setIntentos(intentos + 1);
      //si no hay vacios se realiza la comparacion con el numero secreto
      console.log('Número secreto:', numeroSecreto);
      console.log('Números ingresados:', valoresIngresados);
      
      calcularCoincidencias(numeroSecreto);
      const resultado = numeroSecreto.every((valor, index) => parseInt(valor) === parseInt(valoresIngresados[index]));

      console.log('Resultado:', resultado);

      console.log('nro de intento', intentos)
      if (resultado === true) {
        Alert.alert('¡Felicidades!', '¡Eres el ganador!',
          [{
            text: 'Jugar de nuevo este modo',
            onPress: () => {
              // Reiniciar el juego en el mismo modo
              setJuegoEmpezado(true);
              setModo(modoSeleccionado)
              setNumeroSecreto([]);
              generarNumeroSecreto(modoSeleccionado)
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);
            }
          },
          {
            text: 'Finalizar',
            onPress: () => {
              // Juego desde el principio
              setJuegoEmpezado(false);
              setNumeroSecreto([]);
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);
            }
          }]
        );
      } else if (resultado === false && intentos < 9) {

        // Vaciar la lista de números ingresados
        setValoresIngresados(['', '', '', '']);

         // Inhabilitar los inputs según el número de intentos
        const nuevosInputsHabilitados = [...inputsHabilitados]; // Copia el array existente
        nuevosInputsHabilitados[intentos] = false; // Inhabilita los inputs del intento anterior
        nuevosInputsHabilitados[intentos + 1] = true; // Habilita los inputs para el nuevo intento
        setInputsHabilitados(nuevosInputsHabilitados);
      } else if (resultado === false && intentos === 9) {
        Alert.alert('¡Perdiste!', '¡El número secreto era ' + numeroSecreto.join('') + '!',
          [{
            text: 'Jugar de nuevo este modo',
            onPress: () => {
              // Reiniciar el juego en el mismo modo
              setJuegoEmpezado(true);
              setModo(modoSeleccionado)
              setNumeroSecreto([]);
              generarNumeroSecreto(modoSeleccionado)
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);
            }
          },
          {
            text: 'Finalizar',
            onPress: () => {
              // Reiniciar el juego del principio 
              setJuegoEmpezado(false);
              setNumeroSecreto([]);
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);

            }
          }]
        );
      }

    }
  };

  const calcularCoincidencias = () => {
    let coincidenciaLugarCorrecto = 0;
    let coincidenciaOtroLugar = 0;
    let noCoinciden = 0;
  
    for (let i = 0; i < numeroSecreto.length; i++) {
      if (numeroSecreto[i] === valoresIngresados[i]) {
        coincidenciaLugarCorrecto++;
      } else if (valoresIngresados.includes(numeroSecreto[i])) {
        coincidenciaOtroLugar++;
      } else if (!valoresIngresados.includes(numeroSecreto[i])){
        noCoinciden++;
      }
    }
  
    //const noCoinciden = numeroSecreto.length - coincidenciaLugarCorrecto - coincidenciaOtroLugar;
  
    //console.log('Coincidencia en el lugar correcto:', coincidenciaLugarCorrecto);
    //console.log('Coincidencia en otro lugar:', coincidenciaOtroLugar);
    //console.log('No coinciden:', noCoinciden);
    setBRM([coincidenciaLugarCorrecto, coincidenciaOtroLugar, noCoinciden]);

    const nuevoBRMlog = [...brmlog]; // Copia el array existente
    nuevoBRMlog[intentos-1] = brm; 
    setBRMlog(nuevoBRMlog);
  };

  const manejadorBotonRendirse = () => {
    Alert.alert('Te rendiste', '¿Que quieres hacer?',
          [{
            text: 'Intentar de nuevo este modo',
            onPress: () => {
              // Reiniciar el juego en el mismo modo
              setJuegoEmpezado(true);
              setModo(modoSeleccionado)
              setNumeroSecreto([]);
              generarNumeroSecreto(modoSeleccionado)
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);
            }
          },
          {
            text: 'Salir de este juego',
            onPress: () => {
              // Reiniciar el juego en el mismo modo
              setJuegoEmpezado(false);
              setNumeroSecreto([]);
              setValoresIngresados(['', '', '', '']);
              setValoresIngresadosLog([[], [], [], [], [], [], [], [], [], []])
              setInputsHabilitados([true, false, false, false, false, false, false, false, false, false]);
              setBRM(['', '', '']);
              setBRMlog([['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
              setIntentos(0);
            }
          }]
        );
  }

  const rederizarSeleccionarModo = () => (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./assets/images/logo.png')}/>
      <StatusBar style="auto" />
      <Text style={styles.tituloModo}>Elegí el modo</Text>
        <View>
          <TouchableOpacity style={styles.btnContainer} onPress={() => manejadorModo('facil')}>
            <Image source={require('./assets/images/modofacil.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnContainer}onPress={() => manejadorModo('dificil')}>
            <Image source={require('./assets/images/mododificil.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
    </View>
  ); 
  

  const renderizarJuego = () => (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.tituloModoElegido}>Modo {modoSeleccionado}</Text>
      <View style={styles.inputContainer}>       
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[0]} value={valoresIngresadosLog[0][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[0]} value={valoresIngresadosLog[0][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[0]} value={valoresIngresadosLog[0][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[0]} value={valoresIngresadosLog[0][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 1 ? brm[0] : brmlog[0][0]} |  Regular: {intentos === 1 ? brm[1] : brmlog[0][1]}  |  Mal: {intentos === 1 ? brm[2] : brmlog[0][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[1]} value={valoresIngresadosLog[1][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[1]} value={valoresIngresadosLog[1][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[1]} value={valoresIngresadosLog[1][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[1]} value={valoresIngresadosLog[1][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 2 ? brm[0] : brmlog[1][0]} |  Regular: {intentos === 2 ? brm[1] : brmlog[1][1]}  |  Mal: {intentos === 2 ? brm[2] : brmlog[1][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[2]} value={valoresIngresadosLog[2][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[2]} value={valoresIngresadosLog[2][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[2]} value={valoresIngresadosLog[2][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[2]} value={valoresIngresadosLog[2][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 3 ? brm[0] : brmlog[2][0]} |  Regular: {intentos === 3 ? brm[1] : brmlog[2][1]}  |  Mal: {intentos === 3 ? brm[2] : brmlog[2][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[3]} value={valoresIngresadosLog[3][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[3]} value={valoresIngresadosLog[3][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[3]} value={valoresIngresadosLog[3][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[3]} value={valoresIngresadosLog[3][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 4 ? brm[0] : brmlog[3][0]} |  Regular: {intentos === 4 ? brm[1] : brmlog[3][1]}  |  Mal: {intentos === 4 ? brm[2] : brmlog[3][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[4]} value={valoresIngresadosLog[4][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[4]} value={valoresIngresadosLog[4][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[4]} value={valoresIngresadosLog[4][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[4]} value={valoresIngresadosLog[4][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 5 ? brm[0] : brmlog[4][0]} |  Regular: {intentos === 5 ? brm[1] : brmlog[4][1]}  |  Mal: {intentos === 5 ? brm[2] : brmlog[4][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[5]} value={valoresIngresadosLog[5][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[5]} value={valoresIngresadosLog[5][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[5]} value={valoresIngresadosLog[5][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[5]} value={valoresIngresadosLog[5][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 6 ? brm[0] : brmlog[5][0]} |  Regular: {intentos === 6 ? brm[1] : brmlog[5][1]}  |  Mal: {intentos === 6 ? brm[2] : brmlog[5][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[6]} value={valoresIngresadosLog[6][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[6]} value={valoresIngresadosLog[6][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[6]} value={valoresIngresadosLog[6][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[6]} value={valoresIngresadosLog[6][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 7 ? brm[0] : brmlog[6][0]} |  Regular: {intentos === 7 ? brm[1] : brmlog[6][1]}  |  Mal: {intentos === 7 ? brm[2] : brmlog[6][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[7]} value={valoresIngresadosLog[7][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[7]} value={valoresIngresadosLog[7][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[7]} value={valoresIngresadosLog[7][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[7]} value={valoresIngresadosLog[7][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 8 ? brm[0] : brmlog[7][0]} |  Regular: {intentos === 8 ? brm[1] : brmlog[7][1]}  |  Mal: {intentos === 8 ? brm[2] : brmlog[7][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[8]} value={valoresIngresadosLog[8][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[8]} value={valoresIngresadosLog[8][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[8]} value={valoresIngresadosLog[8][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[8]} value={valoresIngresadosLog[8][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 9 ? brm[0] : brmlog[8][0]} |  Regular: {intentos === 9 ? brm[1] : brmlog[8][1]}  |  Mal: {intentos === 9 ? brm[2] : brmlog[8][2]}  </Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(0, text)} editable={inputsHabilitados[9]} value={valoresIngresadosLog[9][0] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(1, text)} editable={inputsHabilitados[9]} value={valoresIngresadosLog[9][1] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(2, text)} editable={inputsHabilitados[9]} value={valoresIngresadosLog[9][2] ?? ''}/>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText={(text) => manejadorValorIngresado(3, text)} editable={inputsHabilitados[9]} value={valoresIngresadosLog[9][3] ?? ''}/>
          <Text style={styles.brm}> Bien: {intentos === 10 ? brm[0] : brmlog[9][0]} |  Regular: {intentos === 10 ? brm[1] : brmlog[9][1]}  |  Mal: {intentos === 10 ? brm[2] : brmlog[9][2]}  </Text>
      </View>
      <View style={styles.btsJuego}>
        <Button color={'#EE6E5C'} title="me rindo" onPress={manejadorBotonRendirse} />
        <Button color={'#3769B4'} title="comprobar" onPress={manejadorBotonComprobar} />
      </View>
    </View>
  );

  return juegoEmpezado ? renderizarJuego() : rederizarSeleccionarModo();

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5B700'
  },

  logo:{
    width: 250,
    height: 120,
    marginBottom: 10,
  },

  tituloModo: {
    fontSize: 15,
    marginBottom: 20,
    fontWeight: 'bold',
    //fontFamily: 'Poppins-Medium',
  },

  tituloModoElegido:{
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    //fontFamily: 'Poppins-Medium',
  },

  image: {
    width: 300, // ajusta el ancho de la imagen según sea necesario
    height: 300, // ajusta la altura de la imagen según sea necesario
  },

  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    paddingTop: 3,
    margin: 2,
    borderWidth: 1,
    width: 35,
    textAlign: 'center',
    fontSize: 30,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  brm: {
    fontWeight: 'bold',
  },

  btsJuego: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 15,
  },
});
