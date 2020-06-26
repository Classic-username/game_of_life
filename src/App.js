import React, {Component} from 'react';
// import Universe from './logic/Universe'

import './App.scss';
import Universe from './logic/Universe';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universe: new Universe(),
      size: [25, 25],
      gameRunning: false,
      speed: 1000,
      color: '#00820b'
    }

    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.speedUp = this.speedUp.bind(this);
    this.slowDown = this.slowDown.bind(this);
    this.clear = this.clear.bind(this);
    this.changeColor = this.changeColor.bind(this);
    

  }

  storeCell(position) {
    if(!this.state.gameRunning) {
      this.setState({
        universe: this.state.universe.storeCell(position)
      })
    }
  }

  handleRowChange(event) {
    if(!this.state.gameRunning) {
      var actualSize = this.state.size

      if(event.target.value < 75)
        actualSize[1] = event.target.value
      
      else
        actualSize[1] = 75
      

      this.setState({
        size: actualSize,
      })

      this.renderBoard()
    }
  }

  handleColumnChange(event){
    if(!this.state.gameRunning){
      var actualSize = this.state.size;
      if(event.target.value < 75)
        actualSize[0] = event.target.value;
    
      else
        actualSize[0] = 75

      this.setState({
        size: actualSize,
      })
      
      this.renderBoard()

    }
  }

  startGame(){
    if(!this.state.gameRunning){
      this.setState({
        gameRunning: true,
        speed: 1000,
      }, () => {
        this.intervalRef = setInterval(() => this.runGame(), this.state.speed)
      })
    }
  }
  
  speedUp(){
    this.stopGame()
    this.setState({speed: this.state.speed / 2})
    this.setState({
      gameRunning: true,
    }, () => {
      this.intervalRef = setInterval(() => this.runGame(), this.state.speed)
    })
  }
  
  slowDown(){
    this.stopGame()
    this.setState({speed: this.state.speed * 2})
    this.setState({
      gameRunning: true,
    }, () => {
      this.intervalRef = setInterval(() => this.runGame(), this.state.speed)
    })
  }
  
  stopGame(){
    this.setState({
      gameRunning: false,
      speed: 1000
    }, () => {
      if(this.intervalRef) {
        clearInterval(this.intervalRef)
      }
    })
    
  }

  clear(){
    this.stopGame()
    this.setState({
      universe: new Universe()
    })
  }

  runGame(){
    this.setState({
      universe: this.state.universe.addGeneration()
    })
  }

  changeColor(e){
    this.setState({
      color: e.target.value
    })
  }

  renderBoard(){
    var newWorld = []
    var cellRow = []
    for(var i = 0; i < this.state.size[0]; i++){
      for (var j = 0; j < this.state.size[1]; j++){
        if(this.state.universe.isCellAlive(i + ' , ' + j)){
          
          cellRow.push(
          <Cell color={this.state.color} key={[i, j]} position={{x: i, y: j}} live={true} storeCell={this.storeCell.bind(this)}/>)
        } else {
          cellRow.push(
          <Cell color={'#778200'} key={[i, j]} position={{x: i, y: j}} live={false} storeCell={this.storeCell.bind(this)}/>)
          
          }
      }
      newWorld.push(<div className='row' key={i}>{cellRow}</div>)
      cellRow = []
    }
    return newWorld
  }


  // Control f this on the page 'After all this, we end up with the html structure for our game. Although the board doesn’t show up, we can now see how our header looks like.'
  // to this link https://revs.runtime-revolution.com/implementing-conways-game-of-life-with-react-part-1-c0b974ae33eb

  render() {


    
    return (
      <div className="worldContainer">
        <div className='headerContainer'>
          <div className='title'>
            <h2>Conway's Game of Life</h2>
          </div>
          <div classname='headerInnerContainer'>
            <label className='label'>
              Rows:   
              <input className='input' type='text' value={this.state.size[1]} onChange={this.handleRowChange} />
            </label>
            <label className='label'>
              Columns:
              <input className='input' type='text' value={this.state.size[0]} onChange={this.handleColumnChange} />
            </label>
          </div>
          <div className='headerButtons'>
              <button className='submit' onClick={this.startGame}>Start</button>
              <button className='submit' onClick={this.stopGame}>Stop</button>
              <button className='submit' onClick={this.speedUp}>Faster</button>
              <button className='submit' onClick={this.slowDown}>Slower</button>
              <button className='submit' onClick={this.clear}>Clear</button>
          </div>
    <div className='speedStatus'>Current speed is 1 generation every {this.state.speed > 1000 ? `${this.state.speed / 1000} seconds` : `${this.state.speed / 1000} second`}.</div>
            <label className='label'>
              Change live color:
              <input className='input' type='text' value={this.state.color} onChange={(e) => {this.changeColor(e)}} />
            </label>
          Generation: {this.state.universe.getGeneration()}
        </div>
        <div className='boardContainer'>
          <div className='boardBox'>{this.renderBoard()}</div>
        </div>
        <div className='rules'>
          <div>
            <h3>Controls</h3>
            <p>Click a cell to toggle dead or alive. All are initially dead.</p>
            <p>You can adjust the board size. Minimum is 25, maximum is 90</p>
            <p>Start runs the game at a default interval of 1 second. You cannot edit the board while the game is running.</p>
            <p>Stop ends the generations of the board and allows you to alter the current live and dead cells.</p>
            <p>Faster doubles the speed on each click.</p>
            <p>Slower halves the speed on each click.</p>
            <p>Clear resets the all the cells to dead and generations to 0.</p>
          </div>
          <div className='con'>
            <h3>Conway's rules</h3>
            <p>A live cell with less than two live neighbors dies.</p>
            <p>A live cell with two or three neighbors lives on to the next generation.</p>
            <p>A live cell with more than tree neighbours dies.</p>
            <p>A dead cell with exactly three neighbours is reborn and becomes a live cell.</p>
          </div>
          
        </div>
      </div>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <div style={{backgroundColor: this.props.color}} onClick={() => this.props.storeCell(this.props.position)} className={this.props.live ? 'cellContainerLive' : 'cellContainerDead'}></div>
    )
  }
}