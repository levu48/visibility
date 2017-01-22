/* eslint-disable */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {getStock} from './util/stock';
import flux from 'fluxify';
import Visibility from 'visibilityjs';

const styles = {
    button: {
      fontSize: 14,
      marginTop: 10,
      marginRight: 10,
      marginBottom: 10,
    }
}

class App extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      isVisible: 'true',
      quote: '(not available)',
      time: Date()
    };
    this.requester = null; // request Stock quote
    this.listener = null; // listen to visibility change

    this.startUpdate();
    this.startListening();
  }

  startUpdate = () => {
      this.requester = Visibility.every(5 * 1000, () => this.requestQuote('AAPL'));
  }

  stopUpdate = () => {
    Visibility.stop(this.requester);
  }

  startListening = () => {
    this.listener = Visibility.change(() => {
      this.setState({
        isVisible: !Visibility.hidden()
      });
      console.log(">>> LISTENING, VISIBILITY STATE", this.state);

      if (this.state.isVisible) {
        this.startUpdate();
      } else {
        this.stopUpdate();
      }


    });
  }

  stopListening = () => {
    Visibility.unbind(this.listener);
  }

  requestQuote(stockName) {
    getStock({ stock: stockName }, 'quotes', (err, data) => {
        this.setState({
          quote: data.quote.Ask,
          time: Date()
        });
        console.log(">>> STOCK QUOTE DATA FROM YAHOO:", data);
    });
  }

  render() {
    return (
      <div>
          <h2>Test page visibility</h2>
          <hr/>
          <div style={{fontSize:14}}>
              <p>This app sends out an asynchronous request to get Apple stock quote from Yahoo Financial
               API every 5 seconds. The stock quote value might be unchanged, but notice the timestamp is 
               changing every 5 seconds.</p>
              <p>You can turn on/off page visibility test by click on the buttons.</p>
              <p>Open "inspect" window to see console logs while testing the page visibility by clicking 
              on different browser tabs to cover and uncover the visibility of the page.</p>
          </div>
          <hr/>
          <p className="App-intro" style={{textAlign: 'left'}}>
              APPL: <span style={{color: '#ff0000'}}>{this.state.quote}</span> USD<br/>
              <span style={{fontSize: 14}}>{this.state.time}</span><br/>
      

              <input type='button' style={styles.button} value='Start listening to visibility change' onClick={this.startListening} />
              <input type='button' style={styles.button} value='Stop listening' onClick={this.stopListening} />
          </p>
      </div>
    );
  }
}

export default App;
