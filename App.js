/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const backgroundStyle = {
    backgroundColor: Colors.darker,
    flex: 1,
  };

  const html = `
    <h1>hellow world!!!!!</h1>
    <canvas id="canvas" height=1024 width=768 
      style="background-color: yellow;"></canvas>
    <h1>hello world 2!!</h1>  

    <script>

    var canvasRef = document.getElementById("canvas");
    var ctx = canvasRef.getContext("2d");
    var canDraw = false;
    var position = {x: 0, y: 0};

    const getCoordinates = (canvas, event) => {
      if (!canvas || !event) {
        return {};
      }
      const rect = canvas.getBoundingClientRect();
    
      let positionX;
      let positionY;
    
      // First check if it is a touch event.
      // Tricky because GCanvas uses event.nativeEvent object,
      // while web canvas uses event.changedTouches (array, position 0).
      if (event.changedTouches) {
        // Web Canvas touch
        positionX = event.changedTouches[0]?.pageX;
        positionY = event.changedTouches[0]?.pageY;
      } else if (event.nativeEvent?.pageX && event.nativeEvent?.pageY) {
        // Either Mobile GCanvas touch or Web Canvas mouse click
        positionX = event.nativeEvent?.pageX;
        positionY = event.nativeEvent?.pageY;
      } else {
        // Shouldn't happen (being super safe to catch a web Canvas mouse click)
        positionX = event.pageX;
        positionY = event.pageY;
      }
    
      return {
        x: positionX - rect.left,
        y: positionY - rect.top,
      };
    };
    
    const drawLine = (
      canvas,
      originalPosition,
      newPosition,
      color,
      size,
    ) => {
      if (!canvas) {
        return;
      }
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = color || '#FF0000';
        context.lineJoin = 'round';
        context.lineWidth = size || 5;
        context.beginPath();
        context.moveTo(originalPosition.x, originalPosition.y);
        context.lineTo(newPosition.x, newPosition.y);
        context.closePath();
        context.stroke();
      }
    };
    
    const startDraw = event => {
      const coordinates = getCoordinates(canvasRef, event);
      if (coordinates && coordinates.x && coordinates.y) {
        const newX = coordinates.x + 0.0001;
        const newY = coordinates.y + 0.0001;
        // secondPoint hack, because you can't use drawLine with just 1 point
        const newCoordinates = {x: newX, y: newY};
        canDraw = true;
        position = coordinates;
        drawLine(canvasRef, coordinates, newCoordinates, null, null);
      }
    };
  
    const draw = event => {
      if (canDraw) {
        const newCoordinates = getCoordinates(canvasRef, event);
        if (position && newCoordinates) {
          drawLine(canvasRef, position, newCoordinates, null, null);
          position = newCoordinates;
        }
      }
    };
  
    const exitDraw = event => {
      canDraw = false;
    }

    canvasRef.addEventListener('touchstart', (evt) => {
      console.log("touchstart");
      startDraw(evt);
    });
    canvasRef.addEventListener('touchmove', (evt) => {
      console.log("touchmove");
      draw(evt);
    });
    canvasRef.addEventListener('touchend', (evt) => {
      console.log("touchend");
      exitDraw(evt);
    });
    </script>

  `;

  return (
    <SafeAreaView style={backgroundStyle}>
      <WebView
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        scrollEnabled={false}
        originWhitelist={['*']}
        source={{
          html: html,
        }}
      />
    </SafeAreaView>
  );
};

export default App;
