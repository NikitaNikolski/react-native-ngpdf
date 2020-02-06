import React, {Component} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import {Document, Page} from 'react-pdf';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  onOpenStaticPdf() {
    const {navigate} = this.props.navigation;
    const source = require('./document.pdf');

    navigate('Pdf', {source});
  }

  async onSelectPdf() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const {navigate} = this.props.navigation;

      navigate('Pdf', {source: res});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.staticPdfButton}>
          <Button onPress={() => this.onOpenStaticPdf()} title="Open PDF" />
        </View>
        <View>
          <Button onPress={() => this.onSelectPdf()} title="Select PDF" />
        </View>
      </View>
    );
  }
}

class PdfScreen extends Component {
  static navigationOptions = {
    title: 'PDF',
  };

  render() {
    // const source = require('./document.pdf');
    const source = this.props.navigation.state.params.source;

    return <Pdf source={source} style={styles.pdf} />;
  }
}

class RNPdfScreen extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  };

  onDocumentLoadSuccess = ({numPages}) => {
    this.setState({numPages});
  };

  render() {
    const {pageNumber, numPages} = this.state;
    const source = this.props.navigation.state.params.source;

    return (
      <View>
        <Document
          file="somefile.pdf"
          onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Pdf: PdfScreen,
    RNVersion: RNPdfScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  staticPdfButton: {
    marginRight: 10,
  },
});
