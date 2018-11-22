import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Camera, Permissions } from 'expo';
import CaptureButton from './CaptureButton.js'





export default class CameraTest extends React.Component {

	
  constructor(props){
    super(props);
    this.state = {
			//check why ratio and flash aint working, still not checked.
			ratio: '16:9',
      hasCameraPermission: null,
			type: Camera.Constants.Type.back,
      identifedAs: '',
      loading: false,
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {

		if (this.camera) {

			// this.camera.pausePreview(); DONT USE IT WITH TAKEPICTUREASYNC EVER EVER EVER

			this.setState({
				loading: true,
      })
			
			const options = {
        base64: true
      };
			
			
			const data = await this.camera.takePictureAsync(options)
			
      this.imageIndentification(data.base64);
      
	  }
  }

	imageIndentification(imageData){

		const Clarifai = require('clarifai');

		const app = new Clarifai.App({apiKey: 'API KEY'});

		app.models.predict(Clarifai.GENERAL_MODEL, {base64: imageData})
			.then((response) => this.responseDisplay(response.outputs[0].data.concepts)
			.catch((err) => alert(err))
		);
	}

	responseDisplay(identifiedImage){

		console.log('this state', identifiedImage);

		this.setState((prevState, props) => ({
			identifedAs:identifiedImage,
			loading:false
		}));

		// Alert.alert(
		// 	this.state.identifedAs,
		// 	'',
		// 	{ cancelable: false }
		//   )

		// rework this so it display everything :D
		Alert.alert(
			'Alert Title',
			'My Alert Msg',
			[
				{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{ cancelable: false }
		)

	}
    
	render() {
		  return (
        <Camera ref={ref => {this.camera = ref;}} style={styles.preview}>
        <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
            <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
        </Camera>
		);}
}


const styles = StyleSheet.create({
    preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
	loadingIndicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});