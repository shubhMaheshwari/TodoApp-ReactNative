import React from 'react';

// Import all dependencies from react native
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

  // TODO App dependcies 
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,

} from 'react-native';

import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

// Conts helpful later
const isAndroid = Platform.OS == "android";
const viewPadding = 0;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'TODO',
  };

  state={
    tasks: [],
    text: ""
  };

  changeTextHandler = text => {
    this.setState({text: text} );
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;
        
    if (notEmpty){
      this.setState(
        prevState => {
          let { tasks, text} = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text}),
            text: ""
          };
        },
        () => this.Tasks.save(this.state.tasks)
      );
    }
  
  };

  deleteTask = (i) => {

    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();
        tasks.splice(i,1)

        return{ tasks: tasks};
      },
      () => this.Tasks.save(this.state.tasks)
    );
  };

  componentDidMount(){
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding})
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding})
    );
  
    this.Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
    return (  
      <View style={[styles.container, { paddingBottom: this.state.viewPadding }]} > 
        <FlatList 
          style={styles.list}
          // Data from task
          data={this.state.tasks}
          // How should data look in app using function 
          renderItem={ ({item, index})  => 
            <View>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                <Button title="del" onPress={() => this.deleteTask(index)} /> 
              </View>
              <View style={styles.hr} /> 
            </View>
          }
        />  

      <TextInput 
        style={styles.textInput}
        onChangeText={this.changeTextHandler}
        onSubmitEditing={this.addTask}
        value={this.state.text}
        placeholder="Add Task here"
        returnKeyType="done"
        returnKeyLabel="done"
      />
      </View>
    );  
  };

  Tasks = {
    convertToArrayOfObject(tasks, callback) {
      return callback(
        tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
      );
    },
    convertToStringWithSeparators(tasks) {
      return tasks.map(task => task.text).join("||");
    },
    all(callback) {
      return AsyncStorage.getItem("TASKS", (err, tasks) =>
        this.convertToArrayOfObject(tasks, callback)
      );
    },
    save(tasks) {
      AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
    }
  };
  

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list : {
    width: "100%"
  },
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18
  },
  hr : {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput:{
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "black",
    width: "100%"
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
